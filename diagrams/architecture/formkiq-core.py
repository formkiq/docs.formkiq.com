from diagrams import Cluster, Diagram
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.network import APIGateway
from diagrams.aws.network import Route53
from diagrams.aws.storage import S3
from diagrams.aws.compute import Fargate

with Diagram("Architecture FormKiQ Core", show=False):
    dns = Route53("dns")
    api = APIGateway("API")

    with Cluster("Services"):
        svc_group = [Lambda("processor"),
                     Fargate("services")]

    with Cluster("DB Cluster"):
        db = Dynamodb("Documents")
        db - [Dynamodb("Documents")]

    with Cluster("Data Storage"):
        s3 = S3("Documents")
        s3 - [S3("Documents")]

    dns >> api >> svc_group
    svc_group >> db
    svc_group >> s3