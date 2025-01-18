import { cn } from '@/lib/utils'
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from 'react'

type FormControlProps = {
	variant?: 'line' | 'box'
	labelLeft?: ReactNode | string
	labelRight?: ReactNode | string
	inputLeft?: ReactNode
	inputRight?: ReactNode
	paragraph?: boolean
	error?: boolean
	type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url'
	caption?: string
	asChild?: boolean
	showClearBtn?: boolean
	children?: ReactNode
} & ComponentPropsWithoutRef<'input'> &
	ComponentPropsWithoutRef<'textarea'>

export const FormControl = forwardRef<any, FormControlProps>(
	(
		{
			variant = 'line',
			labelLeft,
			labelRight,
			asChild = false,
			paragraph = false,
			showClearBtn = false,
			error,
			type,
			caption,
			inputLeft,
			inputRight,
			className,
			children,
			...rest
		},
		ref
	) => (
		<div className={cn('space-y-3', className)}>
			{(!!labelLeft || !!labelRight) && (
				<label className="flex w-full items-end justify-between">
					{typeof labelLeft == 'string' ? (
						<div className="text-xs font-medium text-gray-700 dark:text-gray-200 md:text-sm">
							{labelLeft.toUpperCase()}
						</div>
					) : (
						labelLeft
					)}
					{(labelLeft || labelRight) && <div className="grow" />}
					{typeof labelLeft == 'string' ? (
						<div className="self-end text-sm text-gray-500">
							{labelRight}
						</div>
					) : (
						labelRight
					)}
				</label>
			)}
			<div
				className={cn(
					'flex items-center gap-2 transition duration-300',
					{
						'bg-transparent': variant == 'line',
						'rounded-lg border border-gray-100 bg-gray-100 bg-transparent px-3 dark:border-gray-600':
							variant == 'box',
						'border border-red-400': error && variant == 'box',
						'border-b border-red-400':
							!asChild && error && variant == 'line',
						'border-b focus-within:border-blue-200':
							!asChild && variant == 'line'
					}
				)}
			>
				{!!inputLeft && (
					<div className="p-2 text-lg text-gray-500">{inputLeft}</div>
				)}
				{!asChild ? (
					paragraph ? (
						<textarea
							ref={ref as any}
							className="flex w-full resize-none appearance-none overflow-auto bg-transparent py-3 text-md shadow-none outline-none placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							{...rest}
						/>
					) : (
						<input
							ref={ref as any}
							type={type}
							className="flex h-10 w-full bg-transparent py-3 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
							{...rest}
						/>
					)
				) : (
					children
				)}
				{/* {showClearBtn && (
						<Button
							size="icon-sm"
							variant="ghost-secondary"
							className="text-gray-500"
						>
							<X />
						</Button>
					)} */}
				{!!inputRight && (
					<div className="p-2 text-lg text-gray-500">
						{inputRight}
					</div>
				)}
			</div>

			{!!caption && (
				<caption
					className={cn('block text-left text-xs', {
						'text-gray-500': !error,
						'text-red-500': error
					})}
				>
					{caption}
				</caption>
			)}
		</div>
	)
)

FormControl.displayName = 'FormControl'
