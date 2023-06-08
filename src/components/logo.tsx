export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill='currentColor' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        d='M336 176h40a40 40 0 0 1 40 40v208a40 40 0 0 1-40 40H136a40 40 0 0 1-40-40V216a40 40 0 0 1 40-40h40'
      />
      <path
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='32'
        d='m176 272 80 80 80-80M256 48v288'
      />
    </svg>
  )
}
