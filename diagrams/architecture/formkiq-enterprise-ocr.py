from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import ECS, Lambda, LambdaFunction
from diagrams.aws.database import ElastiCache, RDS, Dynamodb
from diagrams.aws.network import ELB, APIGateway, CloudFront
from diagrams.aws.network import Route53
from diagrams.aws.storage import S3
from diagrams.aws.integration import SNS, SQS 
from diagrams.aws.ml import Textract
from diagrams.aws.analytics import ES
from diagrams.custom import Custom

with Diagram("Architecture FormKiQ and OCR", show=False):
    dns = Route53("dns")
    core_api = APIGateway("Core Api")

    lambda_api = Lambda("API")

    s3_documents = S3("Documents")
    console = CloudFront("Console")
    sns_documentevents = SNS("Document Events")

    with Cluster("Document Staging"):
        document_storage = S3("Staging Documents")
        document_storage - Edge(label="S3 Create Event") - Lambda("Create Document") - Edge(label="Store Document") - s3_documents >> sns_documentevents
        lambda_api >> document_storage

    with Cluster("DynamoDb Tables"):
        db_primary = Dynamodb("Documents")
        db_primary - [Dynamodb("Caching")]

    with Cluster("OCR"):
        ocr = APIGateway("Api") 
        ocr -Lambda("ML Processor") - Textract("AWS Textract") - S3("OCR Documents") 

    dns >> core_api >> lambda_api >> db_primary
    dns >> console >> core_api
    sns_documentevents >> lambda_api
    dns >> ocr
