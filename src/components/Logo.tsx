export default function Logo() {
  return (
    <div className="relative h-[33px] w-[33px]" data-name="Logo">
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <svg
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <rect width="33" height="33" rx="8" fill="url(#paint0_linear)" />
          <defs>
            <linearGradient
              id="paint0_linear"
              x1="0"
              y1="0"
              x2="33"
              y2="33"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7F56D9" />
              <stop offset="1" stopColor="#6941C6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Star/Sparkle Icon */}
        <svg
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <g clipPath="url(#clip0)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.6786 8.25H15.3214V18.6788L11.6517 9.01196L9.71226 9.89346L13.4872 19.8205L5.92113 12.2545L4.50442 13.6712L11.6959 20.8627L2.35349 17.0817L1.33326 18.9933L11.1071 23.0714H0.25V25.4286H11.1071L1.33326 29.5067L2.35349 31.4183L11.6959 27.6373L4.50442 34.8288L5.92113 36.2455L13.4872 28.6795L9.71226 38.6065L11.6517 39.488L15.3214 29.8212V40.25H17.6786V29.8212L21.3483 39.488L23.2877 38.6065L19.5128 28.6795L27.0789 36.2455L28.4956 34.8288L21.3041 27.6373L30.6465 31.4183L31.6667 29.5067L21.8929 25.4286H32.75V23.0714H21.8929L31.6667 18.9933L30.6465 17.0817L21.3041 20.8627L28.4956 13.6712L27.0789 12.2545L19.5128 19.8205L23.2877 9.89346L21.3483 9.01196L17.6786 18.6788V8.25Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect x="0.25" y="8.25" width="32.5" height="32" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
