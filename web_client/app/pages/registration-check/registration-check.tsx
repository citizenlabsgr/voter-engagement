import * as React from 'react';
import { observer } from 'mobx-react';
import { Voter } from 'models';
import { go } from 'infrastructure/router';

import { Link } from 'components/link/link';
import { MainContentWrapper } from 'components/main-content-wrapper/main-content-wrapper';
import { ShortInput } from 'components/forms/short-input/short-input';
import { Button } from 'components/button/button';
import { Labelled } from 'components/forms/labelled/labelled';
import { BirthdayInput } from 'components/forms/birthday-input/birthday-input';

// CSS
import { styles, vars, css, centeredBox } from 'styles/css';


export type RegistrationCheckProps = {

};

@observer
export class RegistrationCheck extends React.Component<RegistrationCheckProps, {}> {
  state = {
    firstName: "",
    lastName: "",
    zipCode: "",
    birthDate: undefined as Date,
    errors: {} as {
      first_name: string[],
      last_name: string[],
      zip_code: string[],
      birth_date: string[]
    }
  }

  setter(name: string) {
    return (value: any) => {
      this.setState({[name]: value});
    }
  }

  submit = () => {
    this.setState({errors: {}});

    const { firstName, lastName, zipCode, birthDate } = this.state;
    const voter = Voter.currentUser;
    Object.assign(voter, { firstName, lastName, birthDate, zipCode });

    voter.checkRegistration().then(r => {
      if (r) {
        go('/registration-verified');
      } else {
        go('/not-registered');
      }
    }).catch(e => {
      this.setState({errors: e})
    })
  }

  render() {
    return (
      <MainContentWrapper>
        <div {...style.box}>
          <form {...style.maxWidth} onSubmit={e => { e.preventDefault(); this.submit(); }}>
            <h1 {...style.heading}>First, let's check if you&rsquo;re registered to vote.</h1>

            <ShortInput label="First Name"
              onChange={this.setter('firstName')}
              errors={this.state.errors.first_name}
              value={this.state.firstName}
              autoComplete="given-name" />

            <ShortInput label="Last Name"
              onChange={this.setter('lastName')}
              errors={this.state.errors.last_name}
              value={this.state.lastName}
              autoComplete="family-name" />

            <BirthdayInput label="Birth Date"
              onChange={this.setter('birthDate')}
              errors={this.state.errors.birth_date}
              value={this.state.birthDate} />

            <ShortInput label="Zip Code"
              onChange={this.setter('zipCode')}
              errors={this.state.errors.zip_code}
              value={this.state.zipCode}
              autoComplete="postal-code" />

            <div {...css(vars.clearFix)}>
              <Button action={() => {}} css={style.button}>Check!</Button>
            </div>

            <div {...style.note}>
              <p>You can also use the <a href="https://webapps.sos.state.mi.us/MVIC/">Secretary of State's website</a></p>
              <p>Already signed up? <Link to="/login">Log in</Link></p>
            </div>
          </form>
        </div>
      </MainContentWrapper>
    );
  }
}

const style = styles({
  heading: {
    textAlign: 'center',
    marginBottom: vars.spacing
  },
  button: {
    float: 'right',
    marginTop: vars.smallSpacing
  },
  note: {
    marginTop: vars.spacing,
    borderTop: vars.borderSimple,
    fontSize: 16
  },
  box: {
    padding: vars.spacing
  },
  maxWidth: {
    maxWidth: 400,
    margin: '0 auto'
  }
});
