import { useState } from 'react';

import { useEffectOnceWhen } from '../../hooks/once';
import { Snackbar, Alert } from '../../barrel/mui.barrel';
import { notificationData, notification } from '../../instances/notification';

export default function NotificationHandler() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({} as notificationData);

  const handleClose = () => {
    setOpen(false);
  };

  useEffectOnceWhen(() => {
    notification.onShow((data) => {
      setData(data);
      setOpen(true);
    });
  });

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={data.message}
      >
        <Alert
          onClose={handleClose}
          severity={data.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {data.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
