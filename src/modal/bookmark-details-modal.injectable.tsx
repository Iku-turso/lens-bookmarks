import { Div, Span } from "@k8slens/element-components";
import { BookmarkAddIcon } from "@k8slens/icon";
import { PlainButton, PrimaryButton, TextInput } from "@k8slens/input-components";
import { ModalContainer, ModalContent, ModalFooter, ModalHeader } from "@k8slens/modal-components";
import { getModalInjectableBunch, getModalKind, type ModalProps, useRespondFromModal } from "@k8slens/modal-contracts";
import { useState } from "react";
import { BookmarkIcon } from "../bookmark-icon";
import { isWebUrl } from "../bookmarks/bookmark";

export interface BookmarkDetailsRequest {
  readonly title: string;
  readonly confirmLabel: string;
  // A new bookmark, rather than one being renamed or edited.
  readonly isNew: boolean;
  readonly name: string;
  // Present when the bookmark's URL is the user's to choose.
  readonly url?: string;
}

export interface BookmarkDetails {
  readonly name: string;
  readonly url?: string;
}

export const bookmarkDetailsModalKind = getModalKind<
  [request: BookmarkDetailsRequest],
  BookmarkDetails | undefined
>()("bookmark-details");

const BookmarkDetailsModal = ({ input: [request] }: ModalProps<typeof bookmarkDetailsModalKind>) => {
  const respond = useRespondFromModal(bookmarkDetailsModalKind);
  const [name, setName] = useState(request.name);
  const [url, setUrl] = useState(request.url ?? "");

  const asksUrl = request.url !== undefined;
  const urlIsValid = !asksUrl || isWebUrl(url.trim());
  const canConfirm = name.trim() !== "" && urlIsValid;

  const confirm = () => {
    if (canConfirm) {
      respond({ name: name.trim(), url: asksUrl ? url.trim() : undefined });
    }
  };

  const confirmOnEnter = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      confirm();
    }
  };

  return (
    <ModalContainer $style={{ width: "calc(var(--unit) * 110)" }}>
      <ModalHeader icon={request.isNew ? <BookmarkAddIcon /> : <BookmarkIcon />}>{request.title}</ModalHeader>

      <ModalContent>
        <Div $flex={{ direction: "vertical", gap: "m" }}>
          <Div $flex={{ direction: "vertical", gap: "xs" }}>
            <Span>Name</Span>
            <TextInput
              autoFocus
              placeholder="Bookmark name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={confirmOnEnter}
            />
          </Div>

          {asksUrl && (
            <Div $flex={{ direction: "vertical", gap: "xs" }}>
              <Span>URL</Span>
              <TextInput
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={confirmOnEnter}
              />
              {url.trim() !== "" && !urlIsValid && (
                <Span $color="textMuted">Enter an http:// or https:// address.</Span>
              )}
            </Div>
          )}
        </Div>
      </ModalContent>

      <ModalFooter>
        <PlainButton onClick={() => respond(undefined)}>Cancel</PlainButton>
        <PrimaryButton $disabled={!canConfirm} onClick={confirm}>
          {request.confirmLabel}
        </PrimaryButton>
      </ModalFooter>
    </ModalContainer>
  );
};

export default getModalInjectableBunch({
  kind: bookmarkDetailsModalKind,
  Component: BookmarkDetailsModal,
  onClose: () => undefined,
});
