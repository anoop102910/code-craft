import { List, useTable, DateField, EditButton, ShowButton } from "@refinedev/antd";
import { Table, Space } from "antd";
import { IProblem } from "../../interfaces";

export const ProblemList = () => {
  const { tableProps } = useTable<IProblem>();

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column dataIndex="difficulty" title="Difficulty" />
        <Table.Column dataIndex="acceptance" title="Acceptance" />
        <Table.Column dataIndex="status" title="Status" />
        <Table.Column<IProblem>
          title="Actions"
          dataIndex="actions"
          render={(_text, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.slug} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
