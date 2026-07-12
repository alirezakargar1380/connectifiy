import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import Label from './components/label';
// import electronLogo from './assets/electron.svg'
import Stack from '@mui/material/Stack';
import { ConnectionInfo } from 'src/utils/internet';
import SvgColor from './components/svg-color';

import computerProtection from '@renderer/assets/icons/computer.svg'

interface Notification {
  show: boolean
  text: string
}

function App(): React.JSX.Element {
  const colors = {
    white: "#000",
    green: "#00ff2a",
    blue: "#47c5ff",
    red: '#ff242f'
  }
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  // const ipcPHandle = (): void => window.electron.ipcRenderer.send('proxy')
  const [maximize, setMaximize] = useState<'open' | 'close'>("open");
  const [enableProxy, setEnableProxy] = useState<boolean>(false);
  const [internetStatus, setInternetStatus] = useState<'green' | 'blue' | 'red' | 'white'>('white');
  const [proxyServer, setProxyServer] = useState<string>("");
  const [dns, setDns] = useState<any[]>([]);
  const [result, setResult] = useState<ConnectionInfo>();
  const [notif, setNotif] = useState<Notification>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const toggle = () => setMaximize(prev => prev === 'open' ? 'close' : 'open');

  const checkConnection = async (): Promise<void> => {
    try {
      console.log('calling check con func')
      setError(null);
      const result = await window.api.getConnectionInfo();
      console.log('result', result)
      setResult(result)

      if (result.isConnected === false)
        setInternetStatus('red')

      if (result.isConnected === true)
        setInternetStatus('green')

      if (result.isConnected && result.hasVPN)
        setInternetStatus('blue')

    } catch (err: any) {
      setError(err.message || 'Failed to check connection');
      console.error('Connection check error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();

    const intervalId = setInterval(checkConnection, 8000);
    return () => clearInterval(intervalId);

  }, []);

  // Listen for monitoring updates
  // useEffect(() => {
  //   // if (autoCheck) {
  //     const handleStatusUpdate = (data: { connected: boolean; details: any }) => {
  //       console.log("data", data)
  //       // setStatus(prev => ({
  //       //   ...prev,
  //       //   isConnected: data.connected,
  //       //   latency: data.details?.details?.latency || null,
  //       //   hasVPN: data.details?.details?.vpn?.hasVPN || false
  //       // }));
  //     };

  //     window.api.onInternetStatus(handleStatusUpdate);

  //     // Start monitoring
  //     window.api.startMonitoring(5000);

  //     return () => {
  //       // window.api.stopMonitoring();
  //     };
  //   // }
  // }, []);

  useEffect(() => {
    const getDns = async () => {

      // Proxy
      window.api.getProxy().then((data) => {
        // console.log("proxy: ", data)
        if (data === true || data === false) setEnableProxy(data)
        if (enableProxy === false && data === true) {
          // setNotif({
          //   show: false,
          //   text: 'PAY ATTENTION: you set a proxy on youre netword!'
          // })
        }
      });

      // Proxy Server
      window.api.getProxyServer().then((data) => {
        setProxyServer(data)
      })

      // DNS
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

  useEffect(() => {
    if (notif?.show === false && maximize === 'close') {
      setMaximize('open')
      setTimeout(() => {
        setMaximize('close')
      }, 5000)
      setTimeout(() => {
        setNotif({
          ...notif,
          show: true
        })
      }, 6000)
    } else if (notif?.show === false) {
      setTimeout(() => {
        setNotif({
          ...notif,
          show: true
        })
      }, 6000)
    }
  }, [notif])

  // useEffect(() => {
  //   if (maximize === 'open')
  //     window.electron.ipcRenderer.send('not-clickable')
  // }, [maximize])

  return (
    <Box sx={{
      position: 'relative', width: 290, height: 563
      // pointerEvents: 'none',
      // position: 'absolute',
      // overflow: 'hidden'
    }}>
      <Box
        className="widget"
        onMouseEnter={() => {
          console.log('on mouse enter header')
          window.electron.ipcRenderer.send('not-clickable')
        }}
        sx={{
          // width: 100, 
          borderTopRightRadius: '24px',
          borderTopLeftRadius: '24px',
          bgcolor: '#ffffff',
          textAlign: 'right', px: 3, py: 1,
          display: maximize === 'open' ? 'flex' : 'none',
          justifyContent: 'end',
          alignItems: 'center'
          // pointerEvents: maximize === 'open' ? 'auto' : 'none',
          // width: 240,
          // height: 400,
        }}>
        <Box className="nwidget"
          sx={{ width: 'fit-content' }}
          onClick={() => {
            console.log('asdsdfa >>>>')
            setMaximize(maximize === 'close' ? 'open' : 'close')
          }}>
          ⭕
        </Box>
        <Box
          className="nwidget"
          sx={{ width: 16, height: 16, bgcolor: '#58A942', borderRadius: 24 }}
          onClick={() => window.electron.ipcRenderer.send('ping')}
        />
      </Box>
      <Box sx={{
        padding: '16px',
        bgcolor: '#fffffff1',
        borderBottomRightRadius: '24px',
        borderBottomLeftRadius: '24px',
        clipPath: (maximize === 'open') ? 'circle(150% at 210px 30px);' : 'circle(5% at 250px 30px);',
        // ...(notif?.show === false) && {
        //   clipPath: 'circle(150% at 210px 30px);',
        // },
        // ...(maximize === 'open') && {
        //   clipPath: 'circle(150% at 210px 30px);',
        // },
        // ...(maximize === 'close') && {
        //   clipPath: 'circle(8% at 208px 30px);',
        // },
        transition: 'clip-path .9s ease',
        // width: 50, 
        // overflow: 'hidden',
        // pointerEvents: 'none'
      }}>

        <Box
          onClick={() => {
            let newStatus: any = maximize === 'close' ? 'open' : 'close';
            if (newStatus === 'open') window.electron.ipcRenderer.send('not-clickable')
            if (newStatus === 'close') window.electron.ipcRenderer.send('clickable')

            setMaximize(newStatus)
          }}
          sx={{
            color: "#1f1f1f",
            px: 2,
            textAlign: 'center', py: 0.5,
            borderRadius: 4, display: 'flex', mb: 1,
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ fontSize: 12, fontFamily: 'ur-medium' }}>CONNECTION STATUS:</Box>
          <Box
            onMouseEnter={() => {
              if (maximize !== "open")
                window.electron.ipcRenderer.send('not-clickable')
            }}
            onMouseLeave={() => {
              if (maximize !== "open")
                window.electron.ipcRenderer.send('clickable')
            }}
            sx={{
              width: '16px',
              height: '16px',
              // bgcolor: '#00ff2a',
              // bgcolor: '#00ff2a',
              bgcolor: colors[internetStatus],
              borderRadius: 24,
              boxShadow: `0px 0px 17px 1px ${colors[internetStatus]}`,
              animation: `${internetStatus}-loop 1.4s ease-in-out infinite alternate`,
              /* subtle extra glow for depth */
              transition: 'box-shadow 0.2s',
              pointerEvents: 'auto', // 👈 Force click events
              cursor: 'pointer',     // 👈 Add pointer cursor
              position: 'relative',  // 👈 Ensure proper stacking context
              zIndex: 1              // 👈 Bring to front
            }}
          />
        </Box>
        {notif?.show === false && (
          <Box sx={{ bgcolor: '#ffa600', p: 0.5, fontSize: 12, color: 'black' }}>{notif?.text}</Box>
        )}

        {/* ==================== PROXY ==================== */}
        <Box sx={{ bgcolor: '#fff', p: '16px', borderRadius: '16px' }}>
          <Box sx={{ width: 1, textAlign: 'left', mb: 0.5, color: 'black', fontFamily: 'ur-medium', fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SvgColor src={'/src/assets/icons/computer.svg'} sx={{ width: 40, height: 40, }} />
            <Box>Proxy</Box>
          </Box>

          <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center', mt: '16px' }}>
            <Box sx={{ fontFamily: 'ur-regular', color: '#3d3d3db0' }}>Proxy Status :</Box>
            <Box sx={{ display: 'flex' }}>
              <Label variant='soft' sx={{ borderRadius: 6, px: 1.2, py: 0 }} color={enableProxy ? 'success' : 'error'}>{enableProxy ? 'on' : 'disable'}</Label>
            </Box>
          </Stack>

          {enableProxy && (
            <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center', mt: '8px' }}>
              <Box sx={{ fontFamily: 'ur-regular', color: '#3d3d3db0' }}>Proxy Server :</Box>
              <Box sx={{ display: 'flex', color: 'black', fontSize: '16px', fontFamily: 'ur-regular' }}>
                {proxyServer}
              </Box>
            </Stack>
          )}
        </Box>
        {/* ==================== PROXY ==================== */}


        {/* ==================== DNS ==================== */}
        <Box sx={{ bgcolor: '#fff', p: '16px', borderRadius: '16px', mt: 2 }}>
          <Box sx={{ width: 1, textAlign: 'left', mb: 0.5, color: 'black', fontFamily: 'ur-medium', fontSize: '16px', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SvgColor src={'/src/assets/icons/internet.svg'} sx={{ width: 40, height: 40, }} />
            <Box>DNS</Box>
          </Box>

          <Stack direction={'column'} spacing={2} sx={{ alignItems: 'center', mt: '16px' }}>
            {dns.map((item, index) => (
              <Stack key={index} direction={'row'} sx={{ justifyContent: 'space-between', alignItems: 'center', width: 1 }}>
                <Box sx={{ fontSize: 16, fontFamily: 'ur-medium', color: '#3d3d3db0' }}>{item.name + ':'}</Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {item.dns.length === 0 && (<Label variant='soft' color='default' sx={{ borderRadius: 24, px: 1 }}>not set</Label>)}
                  {item.dns.map((dns, i) => (
                    <Label variant='soft' color='success' sx={{ borderRadius: 24, px: 1 }}>{dns}</Label>
                  ))}
                  {/* <Box sx={{ fontSize: 12 }}>❌</Box> */}
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
        {/* ==================== DNS ==================== */}

        <Box sx={{ width: 1, textAlign: 'center', bgcolor: '#2e2e2e', mt: 2 }}>VPN</Box>
        <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
          <Box>Status:</Box>
          <Box>
            {(result?.hasVPN) ? <Label variant='filled' color='success'>ON</Label> : <Label variant='filled' color='error'>OFF</Label>}
          </Box>
        </Stack>
        {result?.vpnInterfaces.map((inter: string) => (
          <Label variant='soft' color='info' key={inter}>{inter}</Label>
        ))}
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
