// // REACT COMPONENTS
// import React from 'react';
// import {
//   Form, Input, // Radio
// } from 'semantic-ui-react';

// // // PROJECT COMPONENTS
// // import {
// //   FormPartsContainer, MassiveToggle,
// //   InlineLabelInfo
// // } from './formHelpers';

// REACT COMPONENTS
import React from 'react';
import {
  Button,
  Form,
  Dropdown,
  // Header,
  // Checkbox,
  // Divider,
  // Input
} from 'semantic-ui-react';

// PROJECT COMPONENTS
import {
  FormPartsContainer,
  ColumnHeading
} from './formHelpers';



// ======================
// GENERICS
// ======================
// To be able to adjust sizes easily
// Very specific to household size. May be worth creating
// a constructor for columns in general.
const columnStyle = {
  display: 'inline-block',
  textAlign: 'center',
  marginTop: '0.7em',
  marginBottom: '0.7em'
};

const Columns = {};

Columns.One = function ({ children }) {
  return ( <div style={{...columnStyle, width: '5em'}}> {children} </div> );
}

Columns.Two = function ({ children }) {
  return ( <div style={{...columnStyle, width: '20em'}}> {children} </div> );
}

Columns.Three = function ({ children }) {
  return ( <div style={{...columnStyle, width: '8em'}}> {children} </div> );
}

Columns.Four = function ({ children }) {
  return ( <div style={{...columnStyle, width: '5em'}}> {children} </div> );
}


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const ColumnHeader = function ({ children, columnNum }) {

  var Container = Columns[ columnNum ];

  return (
    <Container>
      <ColumnHeading type={'household'} colName={''}>
          { children }
      </ColumnHeading>
    </Container>
  );

};


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const MemberButton = function ({ className, onClick, iconName }) {
  return (
    <Button circular
      icon={iconName}
      style={{ padding: '0', height: '2.2em', width: '2.2em' }}
      className={className}
      onClick={onClick} />
  );
};


// ======================
// UNIQUE
// ======================

/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const Role = function ({ member, setMember }) {

  var ThisRole = null;

  if ( member.index === 0 ) {

    ThisRole = <span>Head of Household</span>;

  } else if ( member.index === 1 ) {

    var options = [
      { text: 'Spouse of Head of Household', value: 'spouse' },
      { text: 'Household Member', value: 'member' }
    ];

    ThisRole = <Dropdown selection
                  name={'role'}
                  value={member.role}
                  options={options}
                  onChange={setMember}/>

  } else {

    ThisRole = <span>Household Member</span>;

  }

  return ThisRole;
};  // End Role(<>)



/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const MemberField = function ({ household, time, setHousehold }, indx ) {

  var member    = household[ indx ];
  member.index  = indx;


  var onMemberChange = function ( evnt, inputProps ) {
    member[ inputProps.name ] = inputProps.value;
    setHousehold( evnt, household );
  };


  var onMemberChecked = function ( evnt, inputProps ) {
    member[ inputProps.name ] = inputProps.checked;
    setHousehold( evnt, household );
  };


  var removeMember = function ( evnt, inputProps ) {
    household.splice( indx, 1 );
    setHousehold( evnt, household );
  };  // End removeMember()


  // The font size thing is a bit weird, but... later
  return (
    <Form.Field key={indx}>

      <Columns.One>
        <MemberButton className={'remove'} onClick={removeMember} iconName={'remove'}/>
      </Columns.One>

      <Columns.Two>
        <Role member={member} setMember={onMemberChange} />
      </Columns.Two>

      <Columns.Three>Age</Columns.Three>
      <Columns.Four>Disabled</Columns.Four>

    </Form.Field>
  );
};  // End MemberField()


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const getMembers = function ( client, time, setHousehold ) {

  var household = client[ time + 'Household' ],
      props     = {
        household:              household,
        time:                   time,
        setHousehold:   setHousehold
      }

  var mems = [];
  for (let memi = 0; memi < household.length; memi++) {
    mems.push( MemberField( props, memi ) );
  };

  return mems;
};  // End getMembers()


/** @todo description
* 
* @todo Could this be a number field? If not, then a dropdown?
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
const HouseholdContent = function ({ client, time, setClientProperty }) {

  var household = client[ time + 'Household' ];


  var setHousehold = function ( evnt, newHousehold ) {

    var obj = {
      name: time + 'Household',
      value: newHousehold,
      fillFuture: true
    };

    setClientProperty( evnt, obj );

  };  // End setHousehold()


  var addMember = function ( evnt, inputProps ) {

    var member = { age: 30, role: 'member', isDisabled: false, required: false };
    if ( household.length === 1 ) {
      member.role = 'spouse';
    }

    household.push( member );
    setHousehold( evnt, household );

  };  // End addMember()


  return (
    <wrapper className='field-aligner two-column'>
      <wrapper>
        <ColumnHeader columnNum='One'>Add</ColumnHeader>
        <ColumnHeader columnNum='Two'>Role</ColumnHeader>
        <ColumnHeader columnNum='Three'>Age</ColumnHeader>
        <ColumnHeader columnNum='Four'>Disabled</ColumnHeader>
      </wrapper>

      { getMembers( client, time, setHousehold ) }

      <Columns.One>
        <MemberButton circular className={'add'} onClick={addMember} iconName={'plus'} />
      </Columns.One>
    </wrapper>
  );
};  // End HouseholdContent()


/** @todo description
* 
* @function
* @param {object} props
* @property {object} props.__ - explanation
* 
* @returns Component
*/
// `props` is a cloned version of the original props. References broken.
const HouseholdStep = function ( props ) {

  return (
    <Form className='current-household-size-form'>
      <FormPartsContainer
        title     = {'Household'}
        clarifier = {'Information about the members of your household.'}
        left      = {{name: 'Previous', func: props.previousStep}}
        right     = {{name: 'Next', func: props.nextStep}}>
			<HouseholdContent setClientProperty={props.setClientProperty} client={props.client} time={'current'} />
      </FormPartsContainer>
    </Form>
  );

};  // End HouseholdStep()

export { HouseholdStep };
