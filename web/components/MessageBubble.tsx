import { cn } from '@/lib/utils';

export default function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';
  
  return (
    <div className={cn(
      'group w-full',
      isUser 
        ? 'bg-gray-900' 
        : 'bg-gray-800',
      'border-b border-gray-800/50'
    )}>
      <div className="max-w-3xl mx-auto py-4 px-4">
        <div className={cn(
          'flex items-start space-x-4',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}>
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
            isUser ? 'bg-blue-600' : 'bg-green-600'
          )}>
            {isUser ? 'U' : 'AI'}
          </div>
          <div className={cn(
'prose prose-invert max-w-none prose-p:leading-relaxed',
            'prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-lg prose-pre:shadow',
            'prose-code:before:hidden prose-code:after:hidden prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-gray-200',
            'prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5',
            'prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm',
            'prose-a:text-blue-400 hover:prose-a:underline',
            'prose-blockquote:border-l-4 prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic',
            'prose-img:rounded-lg prose-img:border prose-img:border-gray-700',
            'prose-table:border-collapse prose-table:w-full prose-th:bg-gray-800 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-gray-700',
            'prose-hr:border-t prose-hr:border-gray-700',
            'prose-strong:font-semibold',
            'prose-em:italic prose-em:text-gray-300',
            'prose-code:font-mono prose-pre:overflow-x-auto',
            'prose-li:marker:text-gray-400',
            'prose-p:my-3 first:prose-p:mt-0 last:prose-p:mb-0 text-gray-200'
          )}>
            <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
          </div>
        </div>
      </div>
    </div>
  );
}
