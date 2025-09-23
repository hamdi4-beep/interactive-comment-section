function SignIn() {
  return (
    <div className="sign-in">
      <form action="#">
        <fieldset>
          <label htmlFor="email">Email:</label>
          <input type="text" name='email' id='email' />
        </fieldset>
        
        <fieldset>
          <label htmlFor="password">Password:</label>
          <input type="text" name='password' id='password' />
        </fieldset>
        <button>Sign In</button>
      </form>
    </div>
  )
}

export default SignIn