import { React, useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit">
        Task Master
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Register() {
    let navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Terms and Condition
          </Typography>
        </Box>
        <Grid>
        <Typography>
          <h6>Terms of Use  This Agreement was last revised on Jan 28, 2022.</h6>
          <h5>Welcome to Task Master Book Recommend reading website, the website and online service of Task Master. This page explains the terms by which you may use our service. By accessing or using our services, website and software provided through or in connection with the service ("Service"), you agree on behalf of yourself and all members of your household and others who use this Service under your account ("you" or "your") to be bound by this Terms of Use Agreement, the Privacy , and the other applicable rules, policies and terms posted on the book recommend website or provided with the Service (collectively, this "Agreement"), whether or not you are a registered user of our Service.</h5>
          <h5>We reserve the right to amend this Agreement at any time in our sole discretion by posting the revised Agreement on the Task Master book recommend website. Your continued use of the Service after any such changes constitutes your acceptance of the revised Agreement. This Agreement applies to all visitors, users, and others who access the Service ("Users").</h5>
          <h4>1. Use of Our Service</h4>
          <h5>We provides a place for you to discover, track, and talk about books with friends and our community.
            You may change the settings on your My Account page to control your profile and how other members communicate with you. By providing The reading website your email address you consent to our using the email address in accordance with our Privacy Policy.
            TaskMaster Reading website may permanently or temporarily terminate, suspend, or otherwise refuse to permit your access to the Service without notice and liability for any reason, including if you violate any provision of this Agreement, or for no reason. Upon termination for any reason or no reason, you continue to be bound by this Agreement.
            You are solely responsible for your interactions with other Users. We reserve the right, but have no obligation, to monitor disputes between you and other Users. The website shall have no liability for your interactions with other Users, or for any User’s action or inaction.</h5>
          <h4>2. User Content</h4>
          <h5>The reading website takes no responsibility and assumes no liability for any User Content that you or any other Users or third parties post or send over the Service. You understand and agree that any loss or damage of any kind that occurs as a result of the use of any User Content that you post is solely your responsibility. Reading weisite is not responsible for any public display or misuse of your User Content.</h5>
          <h4>3. License Grant</h4>
          <h5>By posting any User Content on the Service, you expressly grant to The reading website a nonexclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, perform, translate, create derivative works from, distribute, and display such content throughout the world in any media. You represent and warrant that you own or otherwise control all of the rights to the content that you post; that the content is accurate; that use of the content you supply does not violate this policy and will not cause injury to any person or entity; and that you will indemnify The reading website for all claims resulting from content you supply. If you submit User Content via the “My Writing” or “Ebook” features, our Terms of Use for Writers apply to that User Content.</h5>
          <h4>4. Eligibility</h4>
          <h5>This Service is intended solely for Users who are thirteen (13) years of age or older, and any registration, use or access to the Service by anyone under 13 is unauthorized, unlicensed, and in violation of this Agreement. If you are under 18 years of age you may use the Service only if you either are an emancipated minor or possess legal parental or guardian consent, and are fully able and competent to enter into the terms, conditions, obligations, affirmations, representations, and warranties set forth in this Agreement, and to abide by and comply with this Agreement.</h5>
          <h4>5. Copyright Complaints</h4>
          <h5>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible via the Service, please send us the following information:</h5>
          <h5>An electronic or physical signature of a person authorized to act on behalf of the copyright owner;</h5>
          <h5>A description of the copyrighted work that you claim has been infringed upon;</h5>
          <h5>A description of the material that is claimed to be infringing and where it is located on the Service;</h5>
          <h5>Your address, telephone number, and e-mail address;</h5>
          <h5>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or law; and
A statement, made under penalty of perjury, that the above information is accurate, and that you are the copyright owner or are authorized to act on behalf of the owner.</h5>
          <h5>The reading website’ Copyright Agent for notice of claims of copyright infringement on its site can be reached as follows:</h5>
          <h5>Copyright Agent</h5>
          <h5>Attn: DMCA Notice</h5>
          <h5>The reading website LLC</h5>
          <h5>188 Spear Street, Suite 250, San Francisco, CA 94105</h5>
          <h5>Email: copyright@The reading website.com</h5>
          <h5>Telephone: (415) 373-1500</h5>
          <h5>Please note that this procedure is exclusively for notifying The reading website and its affiliates that your copyrighted material has been infringed.</h5>
          <h5>This Agreement, and any rights and licenses granted hereunder, may not be transferred or assigned by you, but may be assigned by The reading website without restriction.</h5>
          <h5>No Waiver. No waiver of any term of this Agreement shall be deemed a further or continuing waiver of such term or any other term, and The reading website' failure to assert any right or provision under this Agreement shall not constitute a waiver of such right or provision.</h5>
        </Typography>
        <Grid container justifyContent="center">
        <Typography justifyContent="center">
            <h4>Please contact us with any questions regarding this Agreement.</h4>
        </Typography>
        </Grid>

        </Grid>
        <Grid container justifyContent="center">
            <Button variant='contained' onClick={() => navigate("/register") }>Back to Register</Button>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
