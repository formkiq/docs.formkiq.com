default : 
	  #asciidoctor README.adoc -o index.html
	  mkdir -p build
	  cd ui-bundle && zip -r ../build/ui-bundle.zip *
	  antora antora-playbook.yml

deploy : default
	  aws s3 cp index.html s3://${S3_BUCKET}/docs/index.html
	  aws s3 cp sitemap.xml s3://${S3_BUCKET}/docs/sitemap.xml
	  aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --path "/*"
