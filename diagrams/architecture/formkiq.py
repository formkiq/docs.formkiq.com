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
from diagrams.aws.integration import SNS, SQS 
from diagrams.aws.ml import Textract

graph_attr = {
    "layout":"dot",
    "compound":"true",
}

with Diagram("FormKiQ", show=False, graph_attr=graph_attr):

    with Cluster("API Gateway", direction="TB"):
        api1 = APIGateway("JWT Authorization") 
        api2 = APIGateway("IAM Authorization") 
        api3 = APIGateway("KEY Authorization")

    with Cluster("Applications"):
        web = Client("Web")
        mobile = Mobile("Mobile")
        users = Users("Users")

    with Cluster("Additional Actions and Modules"):
        with Cluster("Fulltext Search"):
            opensearch = ES("OpenSearch")
            typesense = Custom('Typesense', './typesense.png')
            opensearch - Edge(label="OR", style="dotted") - typesense

        with Cluster("Optical Character Recognition"):
            tesseract = Custom("Tesseract OCR","./tesseract.png")
            textract = Textract("AWS Textract")
            textract - Edge(label="OR", style="dotted") - tesseract

        with Cluster("Intelligent Document Classification / Anti-Malware / E-Signature"):
            openai = Custom("OpenAI","./openai.png")
            antimalware = Custom("Anti-Malware","./anti-malware.png")
            docusign = Custom("Docusign","./docusign.png")
            openai - Edge(style="dashed") - antimalware - Edge(style="dashed") - docusign

    with Cluster("FormKiQ"):

        with Cluster("Document Storage"):
            storage = Dynamodb("Amazon DynamoDB") 
            s3 = SimpleStorageServiceS3BucketWithObjects("Amazon S3")
            storage >> s3

        with Cluster("Serverless Processing"):
            processing = Lambda("AWS Lambda") 
            processing2 = Lambda("AWS Lambda")
            processing - Edge(style="dashed") - processing2

        with Cluster("Document Events"):
            messagingSns = SNS("Amazon SNS")
            messagingSqs = SQS("Amazon SQS")
            messagingSns - Edge(style="dashed") - messagingSqs

    web >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api1
    mobile >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api2
    users >> Edge(ltail='cluster_Applications',lhead='cluster_API Gateway') >> api3

    api1 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ') >> storage
    api2 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ') >> processing
    api3 >> Edge(ltail='cluster_API Gateway',lhead='cluster_FormKiQ') >> messagingSns

    s3 >> Edge(ltail='cluster_FormKiQ',lhead='cluster_Fulltext Search') >> opensearch
    processing2 >> Edge(ltail='cluster_FormKiQ',lhead='cluster_Optical Character Recognition') >> textract
    messagingSqs >> Edge(ltail='cluster_FormKiQ',lhead='cluster_Additional Actions and Modules') >> openai
