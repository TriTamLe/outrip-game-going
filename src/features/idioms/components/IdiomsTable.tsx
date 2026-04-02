import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Popconfirm, Space, Table, Typography } from 'antd'
import type { TableColumnsType } from 'antd'
import { idiomTeams, type IdiomRecord } from '../idiomStatus.ts'
import { IdiomStatusTag } from './IdiomStatusTag.tsx'

type IdiomsTableProps = {
  idioms: IdiomRecord[]
  loading: boolean
  deletingId: IdiomRecord['_id'] | null
  onEdit: (idiom: IdiomRecord) => void
  onDelete: (idiom: IdiomRecord) => Promise<void>
}

export function IdiomsTable({
  idioms,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: IdiomsTableProps) {
  const columns: TableColumnsType<IdiomRecord> = [
    {
      title: 'Idiom',
      dataIndex: 'text',
      key: 'text',
      width: 420,
      render: (text: string) => (
        <Typography.Text className="whitespace-pre-wrap text-[0.98rem] text-slate-900">
          {text}
        </Typography.Text>
      ),
    },
    ...idiomTeams.map((team) => ({
      title: team.name,
      key: team.key,
      width: 160,
      render: (_value: unknown, record: IdiomRecord) => (
        <IdiomStatusTag value={record.status[team.key]} />
      ),
    })),
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_value: unknown, record: IdiomRecord) => (
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
            title="Delete this idiom?"
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
    <Table<IdiomRecord>
      className="[&_.ant-table]:!bg-transparent [&_.ant-table-cell]:!align-top [&_.ant-table-container]:!border-0 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-thead>tr>th]:!bg-slate-100/80 [&_.ant-table-thead>tr>th]:!font-semibold [&_.ant-table-thead>tr>th]:!text-slate-700"
      columns={columns}
      dataSource={idioms}
      loading={loading}
      pagination={false}
      rowKey="_id"
      scroll={{ x: 1100 }}
    />
  )
}
