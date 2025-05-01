import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Button,
  Container,
  LinearProgress,
} from "@mui/material";
import JoditEditor from "jodit-react";
import { useLocation, useNavigate } from "react-router-dom";
import useValidation from "../Hooks/useValidation";
import axios from "axios";
import Nav from "../Components/Nav";
import { updateRequest } from "../api/api";
import { UPDATE_DELETE_JOB } from "../api/server";

interface Job {
  title: string;
  content: string;
  status: string;
  resume: File | null;
  resumeOriginalName?: string;
}

export default function AddJobForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventHandler } = useValidation();

  const [errors, setErrors] = useState({ title: "" });
  const [job, setJob] = useState<Job>({
    title: "",
    content: "",
    status: "",
    resume: null,
    resumeOriginalName: "",
  });
  const [isLoading, setLoading] = useState(false);

  const updateValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const ValidationHandler = async (e: any, alterName?: string) => {
    if (!alterName) return;
    const res = await eventHandler(alterName, e.target.value);
    setErrors({ ...errors, [e.target.name]: res });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    setJob(j => ({ ...j, resume: file }));
  };

  const validator = () => Object.values(errors).every(x => x === "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validator()) return;

    try {
      setLoading(true);

      if (!location.state) {
        const formData = new FormData();
        formData.append("title", job.title);
        formData.append("content", job.content);
        formData.append("status", job.status);
        if (job.resume instanceof File) {
          formData.append("resume", job.resume);
        }

        await axios.post("http://localhost:5000/jobRoutes/add-job", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const id = (location.state as any).id;
        // Just update fields, no file upload during update (unless you support PUT w/ FormData)
        await updateRequest(
          UPDATE_DELETE_JOB,
          id,
          {
            title: job.title,
            content: job.content,
            status: job.status,
          },
          ""
        );
      }

      navigate("/ManageJob");
    } catch (err) {
      console.error("Error submitting job:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state) {
      const { title, content, status, resume_original_name } = location.state as any;
      setJob(prev => ({
        ...prev,
        title,
        content,
        status,
        resume: null,
        resumeOriginalName: resume_original_name,
      }));
    }
  }, [location]);

  return (
    <>
      <Nav />
      <Container>
        <Paper elevation={20} sx={{ p: 3, marginTop: "100px", paddingBottom: "30px" }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            {isLoading && <LinearProgress />}

            <Typography variant="h6" sx={{ mb: 2 }}>
              Upload Resume (PDF only)
            </Typography>
            <Button variant="contained" component="label">
              Choose Resume
              <input
                type="file"
                hidden
                accept="application/pdf"
                onChange={handleResumeChange}
              />
            </Button>
            {job.resume instanceof File && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {job.resume.name}
              </Typography>
            )}
            {!job.resume && job.resumeOriginalName && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                Current Uploaded Resume: {job.resumeOriginalName}
              </Typography>
            )}

            <Typography variant="h6" align="center" sx={{ my: 2, color: "#0288d1" }}>
              {location.state ? "Edit Job" : "Add Job"}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  name="title"
                  fullWidth
                  required
                  value={job.title}
                  onChange={updateValue}
                  onBlur={e => ValidationHandler(e, "alphabetsAndSpace")}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography>Job Content:</Typography>
                <JoditEditor
                  value={job.content}
                  onChange={content => setJob(j => ({ ...j, content }))}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Job Status</InputLabel>
                  <Select
                    name="status"
                    value={job.status}
                    label="Job Status"
                    onChange={e => setJob(j => ({ ...j, status: e.target.value as string }))}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
