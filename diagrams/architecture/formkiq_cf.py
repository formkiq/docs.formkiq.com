from diagrams import Cluster, Diagram, Edge, Node
from diagrams.aws.management import Cloudformation
from diagrams.aws.storage import S3
from diagrams.aws.database import Dynamodb
from diagrams.aws.compute import Lambda
from diagrams.aws.network import CloudFront
from diagrams.aws.security import Cognito
from diagrams.aws.network import APIGateway
from diagrams.aws.analytics import ES
from diagrams.aws.ml import Textract, Bedrock, Comprehend

graph_attr = {
    "layout":"dot",
    "compound":"true",
}

with Diagram("FormKiQ CloudFormation Architecture", show=False, direction="TB", graph_attr=graph_attr):
    cf = Cloudformation("CloudFormation")

    with Cluster("FormKiQ Core"):
        api = APIGateway("API Gateway") 
        s3 = S3("S3")
        dynamodb = Dynamodb("DynamoDB")
        lambda_service = Lambda("Lambda")
        cloudfront = CloudFront("CloudFront")
        cognito = Cognito("Cognito")

    with Cluster("Additional FormKiQ Features and Modules"):
        textract = ES("Textract")
        opensearch = ES("OpenSearch")
        comprehend = Comprehend("Comprehend")
        bedrock = Bedrock("Bedrock")
    
    cf >> Edge(lhead='cluster_FormKiQ Core') >> api
    cf >> Edge(lhead='cluster_FormKiQ Core') >> cognito
    dynamodb >> Edge(lhead='cluster_Additional FormKiQ Features and Modules') >> opensearch
    lambda_service >> Edge(lhead='cluster_Additional FormKiQ Features and Modules') >> comprehend