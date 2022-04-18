default : 
	  asciidoctor README.adoc -o index.html

deploy : default
	  aws s3 cp index.html s3://${S3_BUCKET}/blog/index.html
	  aws s3 cp sitemap.xml s3://${S3_BUCKET}/blog/sitemap.xml
	  aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --path "/*"
