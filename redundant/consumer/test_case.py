from boto3 import client

s3 = client('s3', "s3",
    endpoint_url="http://localhost:9000",
    aws_access_key_id="test",
    aws_secret_access_key="test1234", )

def get_test_case(problem_id):
    try:
        response = s3.get_object(Bucket='test', Key=f'problem-id-{problem_id}.txt')
        return response['Body'].read().decode('utf-8')
    except Exception as e:
        print("something went wrong",e)
        raise e



