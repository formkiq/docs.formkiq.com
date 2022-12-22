from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.database import Dynamodb
from diagrams.aws.network import APIGateway
from diagrams.aws.network import Route53
from diagrams.aws.storage import S3
from diagrams.aws.compute import Fargate
from diagrams.aws.integration import SNS
from diagrams.custom import Custom

with Diagram("Architecture Typesense", show=False):
    
    db_primary = Dynamodb("Dynamodb")
    transformation = Lambda("Typesense Connector")
    typsense = Custom('Typesense', './typesense.png')

    db_primary >> Edge(label="Dynamodb Streams") >> transformation >> Edge(label="Save to") >> typsense