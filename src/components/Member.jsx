<MemberCard
  key={teamMembers[index].name}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 1 }}
>
  <img src={teamMembers[index].image} alt={teamMembers[index].name} style={{
    width: '120px',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '50%',
    marginBottom: '1rem',
    boxShadow: '0 0 15px rgba(255,255,255,0.3)'
  }} />
  <h2>{teamMembers[index].name}</h2>
  <h4>{teamMembers[index].role}</h4>
  <p>{teamMembers[index].bio}</p>
</MemberCard>