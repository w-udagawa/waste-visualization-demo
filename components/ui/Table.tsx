import React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={cn('min-w-full divide-y divide-gray-200', className)}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('bg-gray-50', className)}
        {...props}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('bg-white divide-y divide-gray-200', className)}
        {...props}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn('hover:bg-gray-50 transition-colors', className)}
        {...props}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable = false, sorted = false, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
          sortable && 'cursor-pointer select-none hover:text-gray-700',
          className
        )}
        {...props}
      >
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          {sortable && (
            <span className="flex flex-col">
              <svg
                className={cn(
                  'w-3 h-3',
                  sorted === 'asc' ? 'text-primary-500' : 'text-gray-300'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 5l5 5H5l5-5z" />
              </svg>
              <svg
                className={cn(
                  'w-3 h-3 -mt-1',
                  sorted === 'desc' ? 'text-primary-500' : 'text-gray-300'
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5-5h10l-5 5z" />
              </svg>
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)}
        {...props}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={cn('bg-gray-50', className)}
        {...props}
      >
        {children}
      </tfoot>
    );
  }
);

TableFooter.displayName = 'TableFooter';