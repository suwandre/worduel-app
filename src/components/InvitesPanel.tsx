import { useState, useEffect } from "react";
import {
  Paper,
  Title,
  Text,
  Stack,
  Button,
  Group,
  Badge,
  Tabs,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { apiClient } from "../api/client";
import { useNavigate } from "react-router-dom";
import type { Invite } from "../types";

export default function InvitesPanel() {
  const navigate = useNavigate();
  const [invites, setInvites] = useState<{
    sent: Invite[];
    received: Invite[];
  }>({
    sent: [],
    received: [],
  });
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await apiClient.get("/games/invites/me");
      setInvites(response.data);
    } catch (error) {
      console.error("Failed to fetch invites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToInvite = async (inviteId: string, accept: boolean) => {
    setResponding(inviteId);
    try {
      const response = await apiClient.post(
        `/games/invites/${inviteId}/respond`,
        { accept }
      );

      if (accept && response.data) {
        notifications.show({
          title: "Invite accepted!",
          message: "Redirecting to game...",
          color: "green",
        });
        navigate(`/game/${response.data._id}`);
      } else {
        notifications.show({
          title: "Invite declined",
          message: "Invite has been declined",
          color: "blue",
        });
        fetchInvites();
      }
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to respond to invite",
        color: "red",
      });
    } finally {
      setResponding(null);
    }
  };

  const getStatusBadge = (status: Invite["status"]) => {
    const colors = {
      pending: "yellow",
      accepted: "green",
      declined: "red",
      expired: "gray",
    };
    return <Badge color={colors[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) return <Text>Loading invites...</Text>;

  const pendingReceived = invites.received.filter(
    (inv) => inv.status === "pending"
  );

  return (
    <Paper shadow="md" p="xl" radius="md">
      <Title order={3} mb="md">
        Game Invites
      </Title>

      <Tabs defaultValue="received">
        <Tabs.List>
          <Tabs.Tab value="received">
            Received{" "}
            {pendingReceived.length > 0 && `(${pendingReceived.length})`}
          </Tabs.Tab>
          <Tabs.Tab value="sent">Sent</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="received" pt="md">
          {invites.received.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No invites received yet
            </Text>
          ) : (
            <Stack gap="sm">
              {invites.received.map((invite) => {
                const sender =
                  typeof invite.senderId === "object" ? invite.senderId : null;
                return (
                  <Paper key={invite._id} p="md" withBorder>
                    <Group justify="space-between" align="center">
                      <div>
                        <Text fw={500}>
                          From: {sender?.username || "Unknown"}
                        </Text>
                        {invite.message && (
                          <Text size="sm" c="dimmed">
                            "{invite.message}"
                          </Text>
                        )}
                        <Group gap="xs" mt="xs">
                          {getStatusBadge(invite.status)}
                          <Text size="xs" c="dimmed">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </Text>
                        </Group>
                      </div>
                      {invite.status === "pending" && (
                        <Group gap="xs">
                          <Button
                            size="sm"
                            color="green"
                            onClick={() =>
                              handleRespondToInvite(invite._id, true)
                            }
                            loading={responding === invite._id}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            color="red"
                            variant="outline"
                            onClick={() =>
                              handleRespondToInvite(invite._id, false)
                            }
                            loading={responding === invite._id}
                          >
                            Decline
                          </Button>
                        </Group>
                      )}
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="sent" pt="md">
          {invites.sent.length === 0 ? (
            <Text c="dimmed" ta="center" py="xl">
              No invites sent yet
            </Text>
          ) : (
            <Stack gap="sm">
              {invites.sent.map((invite) => {
                const receiver =
                  typeof invite.receiverId === "object"
                    ? invite.receiverId
                    : null;
                return (
                  <Paper key={invite._id} p="md" withBorder>
                    <Group justify="space-between" align="center">
                      <div>
                        <Text fw={500}>
                          To: {receiver?.username || "Unknown"}
                        </Text>
                        {invite.message && (
                          <Text size="sm" c="dimmed">
                            "{invite.message}"
                          </Text>
                        )}
                        <Group gap="xs" mt="xs">
                          {getStatusBadge(invite.status)}
                          <Text size="xs" c="dimmed">
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </Text>
                        </Group>
                      </div>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
}
