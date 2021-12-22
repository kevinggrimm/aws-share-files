import { useEffect, useState } from "react";
import { Nullable } from "../src/types/generic";
import { purgeName } from "../src/utils/purgeName";
import { functions } from "../src/instances/functions";
import { device } from "../src/services/device.service";
import { VolumeInfo } from "../src/types/content.types";
import { notification } from "../src/instances/notification";
import { truncateString } from "../src/utils/truncateString";
import { InputLabel, Grid, Typography } from "@mui/material";
import { useCurrentContext } from "../src/hooks/context.hook";
import { Button, CardContent, FormControl, Theme } from "@mui/material";
import { Book, FileUpload, Person, UploadFile } from "@mui/icons-material";
import { CardHeader, TextField, MenuItem, Select, Card } from "@mui/material";

const fullWidth = { minWidth: { xs: "100%", sm: "90%", md: "70%", lg: "60%" } };
const maxHeight = 48 * 4.5 + 8;
const stringLength = device.isMobile ? 20 : 50;

function getStyles(theme: Theme) {
  return { fontWeight: theme.typography.fontWeightRegular };
}

export default function Upload() {
  const { theme } = useCurrentContext();

  const [selectedFile, setSelectedFile] = useState<Nullable<File>>();

  const [suggestedVolumes, setSuggestedVolumes] = useState([] as VolumeInfo[]);
  const [selectedVolumeIx, setSelectedVolumeIx] = useState(0);

  const [fileTitle, setFileTitle] = useState("");
  const [fileAuthor, setFileAuthor] = useState("");

  const changeHandler = (event: HTMLInputElement | undefined) => {
    const file = event?.files?.[0] ?? null;

    setSelectedFile(file);
  };

  useEffect(() => {
    const currentVolume = suggestedVolumes[selectedVolumeIx];
    if (currentVolume) {
      setFileTitle(currentVolume.title);
      setFileAuthor(currentVolume.authors?.[0] ?? "");
    }
  }, [selectedVolumeIx, suggestedVolumes]);

  useEffect(() => {
    if (selectedFile) {
      const purgedName = purgeName(selectedFile.name);

      functions.content
        .findAllContent(purgedName)
        .then((volumes) => setSuggestedVolumes(volumes))
        .catch(notification.error);
    }
  }, [selectedFile]);

  return (
    <div>
      <h1>Upload</h1>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={3} sx={fullWidth}>
          <Card variant="elevation">
            <CardHeader title="Upload a new file" />
            <CardContent>
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
                justifyContent="center"
              >
                {selectedFile && (
                  <>
                    <Grid item sx={fullWidth}>
                      <TextField
                        fullWidth
                        disabled
                        label="File name"
                        value={selectedFile?.name}
                      />
                    </Grid>
                    {suggestedVolumes.length ? (
                      <Grid item sx={fullWidth}>
                        <FormControl fullWidth>
                          <InputLabel id="suggestions">
                            Available suggestions
                          </InputLabel>
                          <Select
                            value={selectedVolumeIx}
                            label="Available suggestions"
                            labelId="suggestions"
                            onChange={(e) =>
                              setSelectedVolumeIx(e.target.value as number)
                            }
                            MenuProps={{
                              PaperProps: { style: { maxHeight, width: 250 } },
                            }}
                          >
                            {suggestedVolumes.map((volume, index) => (
                              <MenuItem
                                value={index}
                                key={volume.title}
                                style={getStyles(theme)}
                              >
                                <Typography variant="subtitle2">
                                  ({volume.authors?.[0]})
                                  {truncateString(volume.title, stringLength)}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    ) : null}
                    <Grid item sx={fullWidth}>
                      <TextField
                        fullWidth
                        label="Author"
                        value={fileAuthor}
                        onChange={(e) => setFileAuthor(e.target.value)}
                        InputProps={{
                          endAdornment: <Person />,
                        }}
                      />
                    </Grid>
                    <Grid item sx={fullWidth}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={fileTitle}
                        InputProps={{
                          endAdornment: <Book />,
                        }}
                        onChange={(e) => setFileTitle(e.target.value)}
                      />
                    </Grid>
                  </>
                )}
                <Grid item>
                  <Button variant="contained" component="label">
                    {selectedFile ? "Change file" : "Select file"}
                    <input
                      hidden
                      type="file"
                      onChange={(e) => changeHandler(e.target)}
                    />
                    <UploadFile sx={{ marginX: 2 }} />
                  </Button>
                  {selectedFile && fileAuthor && fileTitle ? (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => {}}
                      sx={{ marginLeft: 2 }}
                    >
                      Upload <FileUpload />
                    </Button>
                  ) : null}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}