import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import type { HiddenItemRecord } from '../hiddenItemTypes.ts'

type HiddenItemsTableProps = {
  hiddenItems: HiddenItemRecord[]
  loading: boolean
  deletingId: HiddenItemRecord['_id'] | null
  onEdit: (hiddenItem: HiddenItemRecord) => void
  onDelete: (hiddenItem: HiddenItemRecord) => Promise<void>
}

export function HiddenItemsTable({
  hiddenItems,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: HiddenItemsTableProps) {
  const columns: TableColumnsType<HiddenItemRecord> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string) => (
        <Typography.Text className="text-[0.98rem] font-medium text-slate-900">
          {name}
        </Typography.Text>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description?: string) =>
        description ? (
          <Typography.Paragraph className="!m-0 !text-sm !leading-6 !text-slate-700">
            {description}
          </Typography.Paragraph>
        ) : (
          <Typography.Text className="text-sm italic text-slate-400">
            No description
          </Typography.Text>
        ),
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      render: (score: number) => (
        <Tag color={score >= 0 ? 'green' : 'red'} className="!mr-0">
          {score > 0 ? `+${score}` : score}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isFound',
      key: 'isFound',
      width: 130,
      render: (isFound: boolean) => (
        <Tag
          className="!mr-0"
          color={isFound ? 'success' : 'default'}
        >
          {isFound ? 'Found' : 'Hidden'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_value: unknown, record: HiddenItemRecord) => (
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
            title="Delete this hidden item?"
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
        {hiddenItems.map((record) => (
          <div
            className="rounded-[22px] border border-slate-200/80 bg-white/72 p-4 shadow-[0_12px_30px_rgba(148,163,184,0.12)]"
            key={record._id}
          >
            <div className="grid gap-4">
              <div className="grid gap-3">
                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Name
                  </Typography.Text>
                  <Typography.Text className="text-[1rem] font-medium text-slate-900">
                    {record.name}
                  </Typography.Text>
                </div>

                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Description
                  </Typography.Text>
                  <Typography.Text className="text-[1rem] text-slate-900">
                    {record.description || 'No description'}
                  </Typography.Text>
                </div>

                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Score
                  </Typography.Text>
                  <Typography.Text
                    className={`text-[1rem] font-medium ${
                      record.score >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {record.score > 0 ? `+${record.score}` : record.score}
                  </Typography.Text>
                </div>

                <div className="grid gap-1 rounded-[16px] bg-slate-100/80 px-3 py-3">
                  <Typography.Text className="text-[0.68rem] font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Status
                  </Typography.Text>
                  <Typography.Text
                    className={`text-[1rem] font-medium ${
                      record.isFound ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {record.isFound ? 'Found' : 'Hidden'}
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
                  title="Delete this hidden item?"
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

        {!loading && hiddenItems.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            No hidden items yet.
          </div>
        ) : null}
      </div>

      <div className="hidden md:block">
        <Table<HiddenItemRecord>
          className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!align-top [&_.ant-table-container]:!border-0 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-slate-100/80 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-slate-700"
          columns={columns}
          dataSource={hiddenItems}
          loading={loading}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 880 }}
        />
      </div>
    </>
  )
}
