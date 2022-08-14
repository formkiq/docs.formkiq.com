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

with Diagram("Clustered Web Services", show=False):
    dns = Route53("dns")
    core_api = APIGateway("Core Api")

    lambda_api = Lambda("API")
    lambda_update = Lambda("Update Document")
    lambda_actions = Lambda("Actions")

    s3_documents = S3("Documents")
    console = CloudFront("Console")
    sns_documentevents = SNS("Document Events")
    sqs_update = SQS("Update Document")
    sqs_actions = SQS("Document Actions")


#    with Cluster("Web"):
#        web_group = [APIGateway("Api"),
#                     CloudFront("Console")]

#    with Cluster("Processing"):
#        svc_processing = [Lambda("API"),
#                     Lambda("New Document"),
#                     Lambda("Update Document"),
#                     Lambda("Actions")]


    with Cluster("OCR"):
        ocr = APIGateway("Api") 
        ocr -Lambda("ML Processor") - Textract("AWS Textract") - S3("OCR Documents")

    with Cluster("OpenSearch"):
        opensearch = APIGateway("Api") 
        opensearch - Lambda("Processor") - ES("OpenSearch") 

    with Cluster("ClamAvCluster"):
        clamavCluster = SQS("ClamAv Queue") 
        clamavCluster - Lambda("Scanner") - Custom('ClamAv', './clamav.png') >> sqs_update
        sns_documentevents >> clamavCluster

    with Cluster("Document Staging"):
        document_storage = S3("Staging Documents")
        document_storage - Edge(label="S3 Create Event") - Lambda("Create Document") - Edge(label="Store Document") - s3_documents >> sns_documentevents
        lambda_api >> document_storage

    with Cluster("DynamoDb Tables"):
        db_primary = Dynamodb("Documents")
        db_primary - [Dynamodb("Caching")]

    dns >> core_api >> lambda_api >> db_primary
    sqs_update >> lambda_update >> s3_documents
    lambda_update >> db_primary
    sqs_actions >> lambda_actions >> core_api
    lambda_actions >> ocr
    lambda_actions >> opensearch
    dns >> console >> core_api
    dns >> ocr
    dns >> opensearch
    #dns >> opensearch_api >> opensearch_lambda >> opensearch_analytics
