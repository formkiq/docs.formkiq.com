from diagrams import Cluster, Diagram, Edge, Node
from diagrams.gcp.analytics import BigQuery, Dataflow, PubSub
from diagrams.gcp.compute import AppEngine, Functions
from diagrams.gcp.database import BigTable
from diagrams.gcp.iot import IotCore
from diagrams.gcp.storage import GCS
from diagrams.onprem.client import Client
from diagrams.generic.device import Mobile
from diagrams.onprem.client import Users
from diagrams.aws.network import Route53
from diagrams.aws.network import APIGateway
from diagrams.aws.database import Dynamodb
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

with Diagram("FormKiQ Architecture", show=False, graph_attr=graph_attr):

    with Cluster("API Gateway", direction="TB"):
        api1 = APIGateway("JWT Authorization") 
        api2 = APIGateway("IAM Authorization") 
        api3 = APIGateway("KEY Authorization")

    with Cluster("Applications"):
        web = Client("Web")
        mobile = Mobile("Mobile")
        users = Users("Users")

    with Cluster("Additional FormKiQ Features and Modules", graph_attr={"margin": "20"}):
        with Cluster("Fulltext Search"):
            opensearch = ES("OpenSearch Managed\n/ Serverless")
            typesense = Custom('Typesense', './typesense.png')
            opensearch - Edge(label="OR", style="dotted") - typesense

        with Cluster("Optical Character Recognition", graph_attr={"margin": "20"}):
            tesseract = Custom("Tesseract OCR","./tesseract.png")
            textract = Textract("AWS Textract")
            textract - Edge(label="OR", style="dotted") - tesseract

        with Cluster("Anti-Malware", graph_attr={"margin": "20"}):
            antimalware = Custom("Anti-Malware","./anti-malware.png")

        with Cluster("E-Signature", graph_attr={"margin": "20"}):
            docusign = Custom("Docusign","./docusign.png")

        with Cluster("Intelligent Document Processing", graph_attr={"margin": "20"}):
            comprehend = Comprehend("Amazon Comprehend")
            bedrock = Bedrock("Amazon Bedrock")
            comprehend - Edge(style="dashed") - bedrock

        antimalware - Edge(ltail='cluster_Anti-Malware',lhead='cluster_E-Signature') - docusign

    with Cluster("FormKiQ Core"):

        with Cluster("Document Storage", graph_attr={"margin": "20"}):
            storage = Dynamodb("Amazon DynamoDB") 
            s3 = SimpleStorageServiceS3BucketWithObjects("Amazon S3")
            storage - Edge(style="dashed") - s3

        with Cluster("Serverless Processing", graph_attr={"margin": "20"}):
            processing = Lambda("RESTful API") 
            actions = Lambda("Document Actions")
            processing >> actions

        with Cluster("Document Events", graph_attr={"margin": "20"}):
            messagingEventBridge = Eventbridge("Amazon Eventbridge")
            messagingSns = SNS("Amazon SNS")
            messagingSqs = SQS("Amazon SQS")
            messagingEventBridge >> messagingSns >> messagingSqs


    web >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api1
    mobile >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api2
    users >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api3

    api1 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ Core') >> processing
    api2 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ Core') >> messagingEventBridge
    api3 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ Core') >> storage

    messagingSqs >> Edge(ltail='cluster_FormKiQ Core',lhead='cluster_Additional FormKiQ Features and Modules') >> antimalware
    actions >> Edge(ltail='cluster_FormKiQ Core',lhead='cluster_Additional FormKiQ Features and Modules') >> textract
    s3 >> Edge(ltail='cluster_FormKiQ Core',lhead='cluster_Additional FormKiQ Features and Modules') >> opensearch
