export default function App({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        body {
          background: #000;
          color: #00ff00;
        }

        #__next {
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
