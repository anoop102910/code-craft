import { useShow } from "@refinedev/core";
import { Show, TextField, TagField, NumberField, MarkdownField } from "@refinedev/antd";
import { Typography, Tag } from "antd";
import { IProblem } from "../../interfaces";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text } = Typography;

export const ProblemShow = () => {
  const { queryResult } = useShow<IProblem>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const handleDownload = () => {
    if (record?.all_test_cases) {
      const blob = new Blob([JSON.stringify(record.all_test_cases)], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${record.slug}-test-cases.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>Title</Title>
      <Text>{record?.title}</Text>

      <Title level={5}>Slug</Title>
      <Text>{record?.slug}</Text>

      <Title level={5}>Description</Title>
      <MDEditor.Markdown source={record?.description} />

      <Title level={5}>Difficulty</Title>
      <Text>{record?.difficulty}</Text>

      <Title level={5}>Acceptance</Title>
      <NumberField value={record?.acceptance ?? 0} />

      <Title level={5}>Frequency</Title>
      <NumberField value={record?.frequency ?? 0} />

      <Title level={5}>Status</Title>
      <Tag>{record?.status}</Tag>

      <Title level={5}>Time Limit</Title>
      <Text>{record?.time_limit}</Text>

      <Title level={5}>Memory Limit</Title>
      <Text>{record?.memory_limit}</Text>

      <Title level={5}>All Test Cases</Title>
      <button onClick={handleDownload} disabled={!record?.all_test_cases}>
        Download Test Cases
      </button>
    </Show>
  );
};
