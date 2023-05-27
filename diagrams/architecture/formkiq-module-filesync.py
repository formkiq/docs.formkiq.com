from diagrams import Cluster, Diagram
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.network import APIGateway
from diagrams.aws.network import Route53
from diagrams.aws.storage import S3
from diagrams.aws.compute import Fargate
from diagrams.aws.integration import SimpleNotificationServiceSns
from diagrams.aws.analytics import CloudsearchSearchDocuments

with Diagram("FormKiQ FileSync Module", show=False):

    with Cluster("Local / File Server / Network Share"):
        documents = CloudsearchSearchDocuments("Document(s)")

    with Cluster("Amazon Web Services (AWS)"):
        s3 = S3("Staging Documents")

    documents >> s3