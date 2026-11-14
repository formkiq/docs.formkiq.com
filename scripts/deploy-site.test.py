import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('deploy', Path(__file__).with_name('deploy-site.py'))
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)


class DeploymentTests(unittest.TestCase):
    def test_manifest_preserves_dotted_clean_urls_and_redirect_stubs(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            for name in ['index.html', 'docs/changelog/v1.19.2/index.html', 'docs/old/index.html', 'assets/app.123.js']:
                path = root / name
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text('test')
            files, aliases = deploy.manifest(root)
            self.assertEqual(set(aliases), {'docs/changelog/v1.19.2', 'docs/old'})
            self.assertEqual(len(files), 4)
            self.assertEqual(deploy.stale_keys([
                'docs/docs/changelog/v1.19.2', 'docs/docs/removed',
                'docs/assets/app.123.js', 'docs/assets/previous-build.js',
                'docs/marketplace/old/parameters.json',
                'other/prefix/file', 'docs-not-ours/file',
            ], set(files) | set(aliases), 'docs'), ['docs/docs/removed'])

    def test_rejects_root_and_ambiguous_deletion_prefixes(self):
        for prefix in ['', '/', '../docs', 'docs/../other', 'docs//other', '/docs']:
            with self.assertRaises(ValueError):
                deploy.validate_prefix(prefix)

    def test_dry_run_does_not_upload_or_delete(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            root.joinpath('index.html').write_text('site')
            with patch.object(deploy, 'aws', return_value='{"Contents": [{"Key": "docs/removed"}]}') as aws:
                deploy.deploy(root, 'test-bucket', 'docs', dry_run=True)
                self.assertEqual(aws.call_count, 1)
                self.assertEqual(aws.call_args.args[:2], ('s3api', 'list-objects-v2'))

    def test_alias_upload_failure_prevents_pruning(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            root.joinpath('index.html').write_text('site')
            root.joinpath('docs').mkdir()
            root.joinpath('docs/index.html').write_text('page')
            calls = []

            def aws(*args):
                calls.append(args)
                if args[:2] == ('s3api', 'list-objects-v2'):
                    return '{"Contents": [{"Key": "docs/removed"}]}'
                if args[:2] == ('s3', 'cp'):
                    raise RuntimeError('simulated upload failure')
                return '{}'

            with patch.object(deploy, 'aws', side_effect=aws), self.assertRaises(RuntimeError):
                deploy.deploy(root, 'test-bucket', 'docs')
            self.assertFalse(any(call[:2] == ('s3api', 'delete-objects') for call in calls))


if __name__ == '__main__':
    unittest.main()
