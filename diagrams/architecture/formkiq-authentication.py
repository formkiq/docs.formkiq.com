from diagrams import Cluster, Diagram, Edge, Node
from diagrams.onprem.client import Client
from diagrams.generic.device import Mobile
from diagrams.onprem.client import Users
from diagrams.aws.network import APIGateway
from diagrams.aws.database import Dynamodb
from diagrams.aws.storage import SimpleStorageServiceS3BucketWithObjects
from diagrams.aws.compute import Lambda
from diagrams.aws.compute import Fargate
from diagrams.aws.analytics import ES
from diagrams.custom import Custom
from diagrams.aws.integration import SNS, SQS 
from diagrams.aws.ml import Textract

graph_attr = {
    "layout":"dot",
    "compound":"true",
}

with Diagram("FormKiQ Authentication", show=False, graph_attr=graph_attr, direction="TB"):

    with Cluster("API Gateway"):
        api1 = APIGateway("JWT Authorization") 
        api2 = APIGateway("IAM Authorization") 
        api3 = APIGateway("KEY Authorization")

    with Cluster("Applications", direction="LR"):
        web = Client("Web")
        mobile = Mobile("Mobile")
        users = Users("Users")

    web >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api1
    mobile >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api2
    users >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api3