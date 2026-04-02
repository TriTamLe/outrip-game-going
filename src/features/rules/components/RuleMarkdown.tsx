import ReactMarkdown from 'react-markdown'

type RuleMarkdownProps = {
  markdown?: string | null
  variant?: 'present' | 'manage'
  emptyText?: string
}

const variantClasses = {
  present: {
    wrapper: 'grid gap-4 text-left text-[24px] leading-[1.6] text-slate-800',
    h1: 'text-3xl font-bold leading-tight text-slate-950 sm:text-4xl',
    h2: 'text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl',
    h3: 'text-xl font-semibold leading-tight text-slate-950 sm:text-2xl',
    list: 'space-y-2',
  },
  manage: {
    wrapper:
      'grid gap-3 text-left text-sm leading-7 text-slate-700 sm:text-[0.96rem]',
    h1: 'text-2xl font-bold leading-tight text-slate-950 sm:text-[1.75rem]',
    h2: 'text-xl font-semibold leading-tight text-slate-950 sm:text-2xl',
    h3: 'text-lg font-semibold leading-tight text-slate-950 sm:text-xl',
    list: 'space-y-1.5',
  },
} as const

export function RuleMarkdown({
  markdown = null,
  variant = 'manage',
  emptyText = 'No rule has been added yet for this game.',
}: RuleMarkdownProps) {
  const classes = variantClasses[variant]

  if (!markdown?.trim()) {
    return <div className="text-sm leading-7 text-slate-500">{emptyText}</div>
  }

  return (
    <div className={classes.wrapper}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className={classes.h1}>{children}</h1>,
          h2: ({ children }) => <h2 className={classes.h2}>{children}</h2>,
          h3: ({ children }) => <h3 className={classes.h3}>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => (
            <ul className={`list-disc pl-6 ${classes.list}`}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={`list-decimal pl-6 ${classes.list}`}>{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-slate-950">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          hr: () => <hr className="border-slate-300/80" />,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-slate-300 pl-4 text-slate-600 italic">
              {children}
            </blockquote>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
