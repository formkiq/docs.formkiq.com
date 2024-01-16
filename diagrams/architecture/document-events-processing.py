from diagrams import Cluster, Diagram, Edge
from diagrams.aws.general import User
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway
from diagrams.aws.integration import SNS, SQS

with Diagram("Document Event Processing", show=False):

    api = APIGateway("Documents API")
    lambda_processor = Lambda("Document Processor")
    sns_documentevents = SNS("Document Events")
    sqs_processing = SQS("Processing Queue")
   
    staging = User("User")
    staging - Edge(label="Create Document") - api - Edge(label="Document Event") - sns_documentevents - Edge(label="Create Event") - sqs_processing - Edge(label="Additional Document Processing") - lambda_processor