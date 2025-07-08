import React from 'react'
import {
  Card as ShadcnCard,
  CardContent,
  CardFooter,
  CardHeader,
} from './ui/card'
import { Badge } from './ui/badge'


interface CardProps {
  id: string
  title: string
  description?: string
  imageUrl: string
  price: number
  brand: string
  size?: string
  isNew?: boolean
}
export function Card({
  title,
  description,
  imageUrl,
  price,
  brand,
  size,
  isNew,
}: CardProps) {
  return (
    <ShadcnCard className="overflow-hidden">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {isNew && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              New
            </Badge>
          )}
        </div>
      </CardHeader>
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 bg-gray-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-500"
              >
                <path
                  d="M12 11.5C13.1046 11.5 14 10.6046 14 9.5C14 8.39543 13.1046 7.5 12 7.5C10.8954 7.5 10 8.39543 10 9.5C10 10.6046 10.8954 11.5 12 11.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 9.5C3 15.0228 7.47715 19.5 13 19.5C18.5228 19.5 23 15.0228 23 9.5C23 3.97715 18.5228 -0.5 13 -0.5C7.47715 -0.5 3 3.97715 3 9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm">{brand}</span>
            </div>
            {size && (
              <div className="flex items-center gap-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-500"
                >
                  <path
                    d="M21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm">{size}</span>
              </div>
            )}
          </div>
          <span className="text-xl font-bold">${price}</span>
        </div>
      </CardContent>
    </ShadcnCard>
  )
}
