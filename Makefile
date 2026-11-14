.PHONY: default api deploy publish

default:
	npm ci
	npm test
	npm run build
	npm run check:build

api:
	npm run clean-api-docs -- formkiq
	npm run gen-api-docs -- formkiq

deploy: default
	$(MAKE) publish

publish:
	python3 scripts/deploy-site.py --bucket "$${S3_BUCKET}" --prefix docs
	aws cloudfront create-invalidation --distribution-id "$${DISTRIBUTION_ID}" --paths "/*"
