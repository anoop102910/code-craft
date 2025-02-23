import boto3
import json
sqs = boto3.client('sqs', region_name='us-east-1',
                   endpoint_url='http://localhost:9324',
                   aws_access_key_id='test',
                   aws_secret_access_key='test' )

queue_url = 'http://local-sqs:9324/queue/test'

def send_to_queue(user_code_id):
    try:
        print('sending to queue')
        response  = sqs.send_message(
            QueueUrl=queue_url,
            MessageBody=json.dumps({"user_code_id":user_code_id}),
            # MessageGroupId='code_queue',
            # MessageDeduplicationId=str(hash(json.dumps(user_code_id)))
        )
        return response
    except Exception as e:
        raise e