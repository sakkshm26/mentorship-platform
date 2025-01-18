import { cn } from '@/lib/utils'
import React, { ComponentProps } from 'react'

type Props = {
	data: {
		company_logo?: string
		name: string
	}
} & ComponentProps<'div'>

const TutorImageWithLogo = ({ data, className, ...rest }: Props) => {
	return (
		<div {...rest} className={cn('relative mb-4', className)}>
			{!!data?.company_logo && (
				<div className="absolute flex items-center h-8 w-1/4 lg:h-6  right-2 top-2 bg-gray-50 px-2 py-3 rounded-full ">
					<img
						src={data?.company_logo}
						alt="company logo"
						className="object-cover"
					/>
				</div>
			)}
			<img
				className="aspect-square w-full object-cover rounded-lg"
				src={`/tutors/${data.name
					.toLowerCase()
					.split(' ')
					.join('_')}.webp`}
				alt="tutor_image"
			/>
		</div>
	)
}

export default TutorImageWithLogo
