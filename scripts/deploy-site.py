#!/usr/bin/env python3
"""Publish a static build, retain clean URL aliases, and prune only owned keys."""
import argparse
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import subprocess

HTML_CACHE = "public,max-age=0,must-revalidate"
ASSET_CACHE = "public,max-age=31536000,immutable"


def validate_prefix(prefix):
    if not prefix or prefix.startswith("/") or any(p in ("", ".", "..") for p in prefix.split("/")):
        raise ValueError("Use an explicit, non-root deployment prefix, such as docs")
    return prefix


def manifest(build):
    files = {p.relative_to(build).as_posix(): p for p in build.rglob("*") if p.is_file()}
    aliases = {key[:-11]: value for key, value in files.items() if key.endswith("/index.html")}
    return files, aliases


def stale_keys(keys, expected, prefix):
    validate_prefix(prefix)
    boundary = prefix + "/"
    return [key for key in keys if key.startswith(boundary)
            and not key.startswith((boundary + "marketplace/", boundary + "assets/"))
            and key[len(boundary):] not in expected]


def aws(*args):
    return subprocess.check_output(["aws", *args], text=True)


def deploy(build, bucket, prefix, dry_run=False):
    validate_prefix(prefix)
    if not build.joinpath("index.html").is_file():
        raise ValueError("Expected a complete production build with index.html")
    if "/" in bucket or not bucket:
        raise ValueError("Pass a bucket name, without an S3 URI or prefix")
    files, aliases = manifest(build)
    destination = f"s3://{bucket}/{prefix}"
    existing = json.loads(aws("s3api", "list-objects-v2", "--bucket", bucket,
                              "--prefix", prefix + "/", "--output", "json"))
    obsolete = stale_keys([o["Key"] for o in existing.get("Contents", [])], set(files) | set(aliases), prefix)
    print(json.dumps({"files": len(files), "clean_url_aliases": len(aliases),
                      "delete_candidates": obsolete, "dry_run": dry_run}, indent=2))
    if dry_run:
        return
    # Keep marketplace artifacts: deployments outside this repo may still use them.
    aws("s3", "sync", str(build), destination, "--exclude", "assets/*",
        "--exclude", "marketplace/*", "--cache-control", HTML_CACHE, "--only-show-errors")
    if build.joinpath("assets").is_dir():
        aws("s3", "sync", str(build / "assets"), destination + "/assets",
            "--cache-control", ASSET_CACHE, "--only-show-errors")
    if build.joinpath("marketplace").is_dir():
        aws("s3", "sync", str(build / "marketplace"), destination + "/marketplace",
            "--cache-control", HTML_CACHE, "--only-show-errors")

    def upload_alias(item):
        key, source = item
        aws("s3", "cp", str(source), destination + "/" + key,
            "--content-type", "text/html", "--cache-control", HTML_CACHE, "--only-show-errors")

    # Preserve extensionless URLs until CloudFront routing is activated separately.
    # Prune only after all uploads succeed, and keep aliases in the expected manifest.
    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(upload_alias, aliases.items()))
    for offset in range(0, len(obsolete), 1000):
        result = json.loads(aws("s3api", "delete-objects", "--bucket", bucket, "--delete",
            json.dumps({"Objects": [{"Key": key} for key in obsolete[offset:offset + 1000]], "Quiet": True})))
        if result.get("Errors"):
            raise RuntimeError("S3 could not delete some stale objects: " + json.dumps(result["Errors"]))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bucket", required=True)
    parser.add_argument("--prefix", default="docs")
    parser.add_argument("--build", default="build", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    arguments = parser.parse_args()
    deploy(arguments.build, arguments.bucket, arguments.prefix, arguments.dry_run)
