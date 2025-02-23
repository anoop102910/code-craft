import boto3
sqs = boto3.client('sqs', region_name='us-east-1',
                   endpoint_url='http://localhost:9324',
                   aws_access_key_id='test',
                   aws_secret_access_key='test' )

queue_url = 'http://local-sqs:9324/queue/test'

def get_messages():
    try:
        response = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10)
        return response.get("Messages",[])
    except Exception as e:
        print("something went wrong",e)
        raise e

def delete_message(receipt_handle):
    print('deleting message')
    try:
        sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=receipt_handle)
        print('message deleted')
    except Exception as e:
        print("something went wrong",e)
        raise e

