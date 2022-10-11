import React, { useCallback, useMemo } from 'react'

import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Modal, ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'

import useTrackContext from '../../context/Track/useTrackContext'
import useFormatMessage from '../../hooks/useFormatMessage'
import { DCLShareData } from '../../hooks/useShare'
import { SegmentShare } from '../../modules/segment'
import TokenList from '../../utils/dom/TokenList'

import './ShareModal.css'

export type ShareModalProps = Omit<ModalProps, 'open'> & {
  data: DCLShareData | null
}

const handleShare = (e: React.MouseEvent<HTMLButtonElement>, url: string) => {
  e.preventDefault()
  const width = 600
  const height = 350
  const top = Math.ceil(window.outerHeight / 2 - height / 2)
  const left = Math.ceil(window.outerWidth / 2 - width / 2)
  window.open(
    url,
    'targetWindow',
    `toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
  )
}

export default React.memo(function ShareModal({
  data,
  ...props
}: ShareModalProps) {
  const l = useFormatMessage()
  const track = useTrackContext()

  const shareableText = useMemo(() => {
    if (data) {
      return data.text ? `${data.title} - ${data.text}` : data.title
    }
    return ''
  }, [data])

  const getFacebookLink = useCallback(() => {
    track(SegmentShare.ShareFallback, { data, social: 'facebook' })
    return encodeURI(l('@growth.ShareModal.uri.facebook', { url: data?.url }))
  }, [data, track])

  const getTwitterLink = useCallback(() => {
    track(SegmentShare.ShareFallback, { data, social: 'twitter' })
    return encodeURI(
      l('@growth.ShareModal.uri.twitter', {
        url: data?.url,
        description: shareableText,
      })
    )
  }, [data, shareableText, track])

  return (
    <Modal
      {...props}
      className={TokenList.join(['share__modal', props.className])}
      open={!!data}
    >
      <Modal.Header>
        <Header>{data?.title}</Header>
        <Button icon onClick={props.onClose}>
          <Icon name="close" />
        </Button>
      </Modal.Header>
      {data?.text && <Modal.Description>{data?.text}</Modal.Description>}
      <Modal.Content>
        <div className="share-modal">
          {data?.thumbnail && (
            <div
              className="thumbnail"
              style={{
                backgroundImage: data.thumbnail
                  ? `url("${data.thumbnail}")`
                  : '',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          )}
          <div className="button-group">
            <Button
              as="a"
              className="button facebook"
              onClick={(e) => handleShare(e, getFacebookLink())}
              href={getFacebookLink()}
            >
              <Icon name="facebook f" /> {l(`@growth.ShareModal.share`)}
            </Button>
            <Button
              as="a"
              className="button twitter"
              onClick={(e) => handleShare(e, getTwitterLink())}
              href={getTwitterLink()}
            >
              <Icon name="twitter" /> {l(`@growth.ShareModal.share`)}
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
})