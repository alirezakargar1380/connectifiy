import { Box } from '@mui/material';
import Versions from './components/Versions'
import { useEffect, useState } from 'react';
import Label from './components/label';
// import electronLogo from './assets/electron.svg'
import Stack from '@mui/material/Stack';

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // const ipcPHandle = (): void => window.electron.ipcRenderer.send('proxy')
  const [maximize, setMaximize] = useState<'open' | 'close'>("open");
  const [enableProxy, setEnableProxy] = useState<boolean>();
  const [proxyServer, setProxyServer] = useState<string>("");
  const [dns, setDns] = useState<any[]>([]);


  const toggle = () => setMaximize(prev => prev === 'open' ? 'close' : 'open');

  useEffect(() => {
    const getDns = async () => {

      // Proxy
      window.api.getProxy().then((data) => {
        // console.log("proxy: ", data)
        if (data === true || data === false) setEnableProxy(data)
      });

      // Proxy Server
      window.api.getProxyServer().then((data) => {
        setProxyServer(data)
      })

      // 
      window.api.getDns().then((data) => {
        // console.log(data)
        setDns(data)
      });
    };

    // بار اول بلافاصله اجرا شود
    getDns();

    // هر ۳ ثانیه اجرا شود
    const interval = setInterval(getDns, 1000);

    // پاک کردن تایمر
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      position: 'relative', width: 240, height: 400
      // pointerEvents: 'none',
      // position: 'absolute',
      // overflow: 'hidden'
    }}>
      <Box // className="widget"
        onMouseEnter={() => window.electron.ipcRenderer.send('not-clickable')}
        sx={{
          // width: 100, 
          bgcolor: '#c7c7c7',
          textAlign: 'right', pr: 1, py: 0.25,
          display: maximize === 'open' ? '' : 'none',
          // pointerEvents: maximize === 'open' ? 'auto' : 'none',
          // width: 240,
          // height: 400,
        }}>
        <Box onClick={() => {
          console.log('asdsdfa >>>>')
          setMaximize(maximize === 'close' ? 'open' : 'close')
        }}>
          ⭕
        </Box>
      </Box>
      <Box sx={{
        padding: 2,
        bgcolor: '#141414e0',
        borderRadius: 4,
        clipPath: maximize === 'open' ? 'circle(150% at 210px 30px);' : 'circle(8% at 212px 30px);',
        transition: 'clip-path .9s ease',
        // width: 50, 
        // overflow: 'hidden',
        // pointerEvents: 'none'
      }}>

        <Box
          onClick={() => {

            // window.electron.ipcRenderer.send(maximize === 'open' ? 'clickable' : 'not-clickable')
            // window.electron.ipcRenderer.send('not-clickable')
            setMaximize(maximize === 'close' ? 'open' : 'close')
          }}
          // onClick={() => console.log('>>')}
          sx={{ bgcolor: "#1f1f1f", pl: 2, pr: 1, textAlign: 'center', py: 0.5, borderRadius: 4, display: 'flex', mb: 1, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: 12 }}>CONNECTION STATUS:</Box>
          <Box
            onMouseEnter={() => {
              console.log('enter')
              window.electron.ipcRenderer.send('not-clickable')
            }}
            onMouseLeave={() => {
              window.electron.ipcRenderer.send('clickable')
              console.log('out')
            }}
            sx={{
              width: '16px',
              height: '16px',
              bgcolor: '#00ff2a',
              borderRadius: 24,
              boxShadow: '0px 0px 17px 1px #00ff2a',
              animation: 'blur-loop 1.4s ease-in-out infinite alternate',
              /* subtle extra glow for depth */
              transition: 'box-shadow 0.2s',
              pointerEvents: 'auto', // 👈 Force click events
              cursor: 'pointer',     // 👈 Add pointer cursor
              position: 'relative',  // 👈 Ensure proper stacking context
              zIndex: 1              // 👈 Bring to front
            }}
          />
        </Box>
        <Box sx={{ width: 1, textAlign: 'center', bgcolor: '#2e2e2e', mt: 2, mb: 0.5 }}>PROXY</Box>
        <Stack direction={'column'} sx={{ alignItems: 'center', justifyContent: 'start', width: 1 }}>
          <Stack direction={'row'} sx={{ width: 1, justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ fontSize: 12 }}>Proxy Staus: </Box>
            <Label variant='filled' sx={{ borderRadius: 6, px: 1.2, py: 0 }} color={enableProxy ? 'success' : 'error'}>{enableProxy ? 'on' : 'off'}</Label>
          </Stack>
          {(enableProxy === true) && (
            <Stack direction={'row'} sx={{ width: 1, justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ fontSize: 12 }}>Proxy Server: </Box>
              <Box sx={{ fontSize: 12 }}>{proxyServer}</Box>
            </Stack>
          )}
        </Stack>
        <Box sx={{ width: 1, textAlign: 'center', bgcolor: '#2e2e2e', mt: 2 }}>DNS</Box>
        {dns.map((item, index) => (
          <Stack key={index} direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
            <Box sx={{ fontSize: 16 }}>{item.name + ':'}</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {item.dns.map((dns, i) => (
                <Box key={i} sx={{ fontSize: 12 }}>{dns}</Box>
              ))}
            </Box>
          </Stack>
        ))}
        <Box sx={{ width: 1, textAlign: 'center', bgcolor: '#2e2e2e', mt: 2 }}>VPN</Box>
        {/* <div className="action">
        <a target="_blank" rel="noreferrer" onClick={() => {
          window.api.getProxy().then((data) => {
            console.log("proxy: ", data)
            if (data === true || data === false) setEnableProxy(data)
          });
          window.api.getProxyServer().then((data) => console.log("getProxyServer: ", data));
          window.api.getVpn().then((data) => { });
          window.api.getDns().then((data) => console.log("dns", data));
        }}>
          Send IPC
        </a>
      </div> */}
        {/* <Versions /> */}
      </ Box>
    </Box>
  )
}

export default App
