import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import type { PostureWordRecord } from '../postureWordTypes.ts'

type PostureWordsTableProps = {
  postureWords: PostureWordRecord[]
  loading: boolean
  deletingId: PostureWordRecord['_id'] | null
  onEdit: (postureWord: PostureWordRecord) => void
  onDelete: (postureWord: PostureWordRecord) => Promise<void>
}

export function PostureWordsTable({
  postureWords,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: PostureWordsTableProps) {
  const columns: TableColumnsType<PostureWordRecord> = [
    {
      title: 'English',
      dataIndex: 'english',
      key: 'english',
      width: 260,
      render: (english: string) => (
        <Typography.Text className="text-[0.98rem] font-medium text-slate-900">
          {english}
        </Typography.Text>
      ),
    },
    {
      title: 'Vietnamese',
      dataIndex: 'vietnamese',
      key: 'vietnamese',
      width: 300,
      render: (vietnamese: string) => (
        <Typography.Text className="text-[0.98rem] text-slate-900">
          {vietnamese}
        </Typography.Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_value: unknown, record: PostureWordRecord) => (
        <Space size="small">
          <Button
            className="!rounded-xl !px-3 !font-medium"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            type="text"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this posture word?"
            okButtonProps={{ danger: true }}
            okText="Delete"
            onConfirm={() => onDelete(record)}
          >
            <Button
              className="!rounded-xl !px-3 !font-medium"
              danger
              icon={<DeleteOutlined />}
              loading={deletingId === record._id}
              type="text"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Table<PostureWordRecord>
      className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!align-top [&_.ant-table-container]:!border-0 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-slate-100/80 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-slate-700"
      columns={columns}
      dataSource={postureWords}
      loading={loading}
      pagination={false}
      rowKey="_id"
      scroll={{ x: 760 }}
    />
  )
}
