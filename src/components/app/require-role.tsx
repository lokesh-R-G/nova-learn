type Props = {
  roles: string[];
  children: React.ReactNode;
};

export function RequireRole({ roles, children }: Props) {
  void roles;
  return <>{children}</>;
}
