default : 
	  asciidoctor README.adoc -o index.html

deploy : default
	  aws s3 cp index.html s3://${S3_BUCKET}/blog/index.html
	  aws cloudfront create-invalidation --distribution-id ${DISTRIBUTION_ID} --path "/*"
