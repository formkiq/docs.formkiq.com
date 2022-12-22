from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.network import APIGateway
from diagrams.aws.network import Route53
from diagrams.aws.storage import S3
from diagrams.aws.compute import Fargate
from diagrams.aws.integration import SNS

with Diagram("Architecture S3", show=False):
    # dns = Route53("dns")
    # api = APIGateway("API")
    # documentEvents = SimpleNotificationServiceSns("Document Events")
    # lambda_api = Lambda("API")
    # s3_documents = S3("Documents")
    db_primary = Dynamodb("Dynamodb")
    sns_documentevents = SNS("Document Events")
    create_document = Lambda("Create Document")
    finalize_document = Lambda("Finalize Document")

    # with Cluster("S3 Documents"):
    documents = S3("S3 Documents")
    # documents - Edge(label="S3 Create Event") - Lambda("Create Document") - Edge(label="Finalize Document") >> sns_documentevents
        # lambda_api >> document_storage

    # with Cluster("S3 Staging"):
    staging = S3("S3 Staging")
    staging - Edge(label="S3 Create Event") - create_document - Edge(label="Store Document")
        # lambda_api >> document_storage

    create_document >> Edge(label="Store Document") >> db_primary
    create_document >> Edge(label="Write Document") >> documents

    documents >> Edge(label="S3 Create Event") >> finalize_document >> Edge(label="Create Document Event") >> sns_documentevents
    finalize_document >> Edge(label="Update Document") >> db_primary

    # staging >> documents
    # lambda_api >> db_primary

    # with Cluster("Services"):
    #     svc_group = [Lambda("processor"),
    #                  Fargate("services")]

    # with Cluster("DB Cluster"):
    #     db = Dynamodb("Documents")
    #     db - [Dynamodb("Documents")]

    # with Cluster("Data Storage"):
    #     s3 = S3("Documents")
    #     s3 - [S3("Documents")]

    # dns >> api >> svc_group
    # svc_group >> db
    # svc_group >> s3
    # svc_group >> documentEvents