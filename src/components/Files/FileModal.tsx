import { ReadMore } from '../Text/ReadMore';
import { Nullable } from '../../types/generic';
import { useDevice } from '../../hooks/device.hook';
import { VolumeChipArray } from '../Data/VolumeChipArray';
import { useEmailsStore } from '../../store/emails.store';
import { useVolumesStore } from '../../store/volumes.store';
import {
  Card,
  CardContent,
  Divider,
  Modal,
  Typography,
  CardHeader,
  Rating,
  Skeleton,
} from '../../barrel/mui.barrel';
import type { S3File } from '../../classes/S3File';

import { FilesAccordion } from './FilesAccordion';

type Props = {
  file: Nullable<S3File>;
  onClose: () => void;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '100%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  overflow: 'scroll',
  maxHeight: '80%',
  width: {
    xs: '95%',
    sm: '80%',
    md: '60%',
    lg: '50%',
    xl: '40%',
  },
} as const;

function FileModal(props: Props) {
  const { file, onClose } = props;

  const open = !!file;
  const { isDesktop } = useDevice();
  const loadEmails = useEmailsStore((x) => x.loadEmails);
  const [volume, getVolume] = useVolumesStore((x) => [x.volume, x.getVolume]);

  loadEmails();

  if (file) getVolume(file.FileInfo.Name);

  const handleClose = () => {
    onClose();
  };

  return file ? (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby={volume?.title ?? file.FileInfo.Name}
      aria-describedby={volume?.subtitle ?? file.FileInfo.Name}
    >
      <Card sx={style} variant="outlined">
        <CardHeader
          action={
            isDesktop
            && volume?.averageRating && (
              <Rating
                name="read-only"
                value={volume.averageRating}
                precision={0.5}
                readOnly
              />
            )
          }
          title={volume?.title ?? file.FileInfo.Name}
          subheader={volume?.subtitle}
        />

        <Divider />
        <CardContent>
          {volume ? (
            <>
              <VolumeChipArray volume={volume} />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: 3 }}
                align="justify"
              >
                <ReadMore text={volume.description} />
              </Typography>
            </>
          ) : (
            <Skeleton animation="wave" variant="text" />
          )}

          <FilesAccordion currentFile={file} />
        </CardContent>
      </Card>
    </Modal>
  ) : null;
}

export { FileModal };
export default FileModal;
