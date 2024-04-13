import clsx from 'clsx'
import { Code, CaretDoubleRight, TrashSimple } from 'phosphor-react'
import * as Breadcrumbs from './Breadcrumbs'
import { CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Document } from '@src/shared/types/ipc';

interface HeaderProps {
  isSidebarOpen: boolean;
}

export function Header({ isSidebarOpen }: HeaderProps) {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutateAsync: deleteDocument, isPending: isDeletingDocument } = useMutation({
    mutationFn: async () => {
      await window.api.deleteDocument({ id: id! });
    },
    onSuccess: () => {
      queryClient.setQueryData<Document[]>(['documents'], (documents) => {
        return documents?.filter((document) => document.id != id);
      })
      navigate('/');
    }
  })


  // const isMacOS = process.platform === 'darwin'

  return (
    <div
      id="header"
      className={clsx(
        'border-b h-14 border-rotion-600 py-[1.4rem] px-6 flex items-center gap-4 leading-tight transition-all duration-250 region-drag z-0',
        {
          // 'pl-24': !isSidebarOpen,
          'w-screen': !isSidebarOpen,
          'w-[calc(100vw-240px)]': isSidebarOpen,
        },
      )}
    >
      <div className={clsx(
        'region-no-drag w-0 h-5',
        {
          'pl-24': !isSidebarOpen
        })}>
      </div>
      <CollapsibleTrigger
        className={clsx('h-5 w-5 text-rotion-200 hover:text-rotion-50 region-no-drag', {
          hidden: isSidebarOpen,
          block: !isSidebarOpen,
        })}
      >
        <CaretDoubleRight className="h-4 w-4" />
      </CollapsibleTrigger>

      {id && (
        <>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item>
              <Code weight="bold" className="h-4 w-4 text-pink-500" />
              Estrutura técnica
            </Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.HiddenItems />
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item>Back-end</Breadcrumbs.Item>
            <Breadcrumbs.Separator />
            <Breadcrumbs.Item isActive>Untitled</Breadcrumbs.Item>
          </Breadcrumbs.Root>

          <div className="inline-flex region-no-drag">
            <button
              onClick={() => deleteDocument()}
              disabled={isDeletingDocument}
              className="inline-flex items-center gap-1 text-rotion-100 text-sm hover:text-rotion-50">
              <TrashSimple className="h-4 w-4" />
              Apagar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
