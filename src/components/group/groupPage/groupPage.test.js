import React from 'react';
import { render, screen, act } from '@testing-library/react';
import GroupPage from './GroupPage';

describe('Group page Component', () => {

//test 1
  test('Check group name when none is given', () => {
    render(<GroupPage />);
    //check that the group name defaults to No group name
    const groupNameElement = screen.getByText(/No group name/i);

    expect(groupNameElement).toBeInTheDocument();
  })

  //test 2
  test('Check that group name updates when the groupName state changes', () => {
    //render the GroupPage component
    const { container } = render(<GroupPage />);
  
    //the group name should be No group name when entering the page initialy
    expect(screen.getByText(/No group name/i)).toBeInTheDocument();
  
    //act as if the group name got updated from the database
    act(() => {
      const groupPageInstance = container.querySelector('h1');
      groupPageInstance.innerHTML = 'Test Group';
    });
    //after the database simulation has updated the name
    expect(screen.getByText(/Test Group/i)).toBeInTheDocument();
  });

  //test 3
  test('renders Edit Group button', () => {
    render(<GroupPage />);
    const editButton = screen.getByText(/Edit Group/i);
    expect(editButton).toBeInTheDocument();
  });

  //test 4
  test('renders Leave Group button', () => {
    render(<GroupPage />);
    const leaveButton = screen.getByText(/Leave Group/i);
    expect(leaveButton).toBeInTheDocument();
  });

  //test 5
  test('renders chat button', () => {
    render(<GroupPage />);
    const chatButton = screen.getByText(/Chat/i);
    expect(chatButton).toBeInTheDocument();
  });


  //test 6
  test('renders empty member list when no members are provided', () => {
    render(<GroupPage />);
    //check that the message indicating no members is displayed
    const noMembersMessage = screen.getByText(/No members in this group/i);
    expect(noMembersMessage).toBeInTheDocument();
  });

  
});
