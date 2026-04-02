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
    <>
      <div className="grid gap-3 md:hidden">
        {postureWords.map((record) => (
          <div
            className="rounded-[22px] border border-slate-200/80 bg-white/72 p-4 shadow-[0_12px_30px_rgba(148,163,184,0.12)]"
            key={record._id}
          >
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    English
                  </Typography.Text>
                  <Typography.Text className="text-[1rem] font-medium text-slate-900">
                    {record.english}
                  </Typography.Text>
                </div>

                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Vietnamese
                  </Typography.Text>
                  <Typography.Text className="text-[1rem] text-slate-900">
                    {record.vietnamese}
                  </Typography.Text>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  className="!h-10 !rounded-2xl !font-medium"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(record)}
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
                    className="!h-10 !rounded-2xl !font-medium"
                    danger
                    icon={<DeleteOutlined />}
                    loading={deletingId === record._id}
                  >
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}

        {!loading && postureWords.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            No posture words yet.
          </div>
        ) : null}
      </div>

      <div className="hidden md:block">
        <Table<PostureWordRecord>
          className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!align-top [&_.ant-table-container]:!border-0 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-slate-100/80 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-slate-700"
          columns={columns}
          dataSource={postureWords}
          loading={loading}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 760 }}
        />
      </div>
    </>
  )
}
