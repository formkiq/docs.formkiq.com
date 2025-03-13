from diagrams import Cluster, Diagram, Edge, Node
from diagrams.gcp.analytics import BigQuery, Dataflow, PubSub
from diagrams.gcp.compute import AppEngine, Functions
from diagrams.gcp.database import BigTable
from diagrams.gcp.iot import IotCore
from diagrams.gcp.storage import GCS
from diagrams.onprem.client import Client
from diagrams.onprem.container import Docker
from diagrams.generic.device import Mobile
from diagrams.onprem.client import Users
from diagrams.onprem.compute import Server
from diagrams.aws.network import Route53
from diagrams.aws.network import APIGateway
from diagrams.aws.database import Dynamodb
from diagrams.k8s.compute import Pod
from diagrams.aws.storage import SimpleStorageServiceS3BucketWithObjects
from diagrams.aws.compute import Lambda
from diagrams.aws.compute import Fargate
from diagrams.aws.analytics import ES
from diagrams.custom import Custom
from diagrams.aws.integration import SNS, SQS, Eventbridge
from diagrams.aws.ml import Textract, Bedrock, Comprehend

graph_attr = {
    "layout":"dot",
    "compound":"true",
}

with Diagram("FormKiQ IAM Authorization", show=False, graph_attr=graph_attr):

    # with Cluster("Users", graph_attr={"margin": "10"}):
    #     web = Client("Web")
    #     mobile = Mobile("Mobile")
    #     users = Users("Users")

    with Cluster("API Gateway", direction="TB", graph_attr={"margin": "10"}):
        api = APIGateway("IAM Authorization") 

    with Cluster("Applications", graph_attr={"margin": "10"}):
        server = Server("Servers")
        docker = Docker("Docker")
        users = Pod("Kubernetes")

    with Cluster("FormKiQ Core"):

        with Cluster("Serverless Processing", graph_attr={"margin": "10"}):
            processing = Lambda("RESTful API") 
            actions = Lambda("Document Actions")
            processing >> actions

    # mobile >> Edge(ltail='cluster_Users',lhead='cluster_Applications') >> docker

    docker >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api

    api >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ Core') >> processing
    # api2 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ Core') >> messagingEventBridge
    # api3 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ Core') >> storage

    # messagingSqs >> Edge(ltail='cluster_FormKiQ Core',lhead='cluster_Additional FormKiQ Features and Modules') >> antimalware
    # actions >> Edge(ltail='cluster_FormKiQ Core',lhead='cluster_Additional FormKiQ Features and Modules') >> textract
    # s3 >> Edge(ltail='cluster_FormKiQ Core',lhead='cluster_Additional FormKiQ Features and Modules') >> opensearch
