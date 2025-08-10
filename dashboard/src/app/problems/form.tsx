import { IProblem } from "../../interfaces";
import {
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  Row,
  Col,
  FormProps,
} from "antd";
import { useForm, useSelect } from "@refinedev/antd";
import { UploadOutlined } from "@ant-design/icons";
import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";

export const ProblemForm: React.FC<{ formProps: FormProps }> = ({
  formProps,
}) => {
  const [markdown, setMarkdown] = useState(formProps.initialValues?.description);

  const handleEditorChange = (value?: string) => {
    setMarkdown(value);
    formProps.form?.setFieldsValue({ description: value });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      formProps.form?.setFieldsValue({ all_test_cases: content });
    };
    reader.readAsText(file);
    return false; // Prevent upload
  };

  return (
    <Form {...formProps} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input the title!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: "Please input the slug!" }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <MDEditor value={markdown} onChange={handleEditorChange} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Difficulty"
            name="difficulty"
            rules={[{ required: true, message: "Please select a difficulty!" }]}
          >
            <Select>
              <Select.Option value="Easy">Easy</Select.Option>
              <Select.Option value="Medium">Medium</Select.Option>
              <Select.Option value="Hard">Hard</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Acceptance"
            name="acceptance"
            rules={[{ required: true, message: "Please input the acceptance rate!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Frequency"
            name="frequency"
            rules={[{ required: true, message: "Please input the frequency!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Example Test Cases" name="example_test_cases">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Constraints" name="constraints">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="All Test Cases" name="all_test_cases">
        <Upload beforeUpload={handleFileUpload} maxCount={1}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Status" name="status">
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Time Limit"
            name="time_limit"
            rules={[{ required: true, message: "Please input the time limit!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Memory Limit"
            name="memory_limit"
            rules={[{ required: true, message: "Please input the memory limit!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
