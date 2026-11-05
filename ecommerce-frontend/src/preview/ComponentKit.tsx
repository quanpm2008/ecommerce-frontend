import { IconFileText, IconLock, IconMapPin, IconUser } from '@tabler/icons-react'
import { useState, type ReactNode } from 'react'
import { PageContainer } from '../components/customer'
import Avatar from '../components/ui/Avatar'
import { toneFor } from '../components/ui/avatar-tone'
import Checkbox from '../components/ui/Checkbox'
import Chip from '../components/ui/Chip'
import Pagination from '../components/ui/Pagination'
import QtyStepper from '../components/ui/QtyStepper'
import Radio from '../components/ui/Radio'
import SelectField from '../components/ui/SelectField'
import SidebarItem from '../components/ui/SidebarItem'
import TextareaField from '../components/ui/TextareaField'
import Toggle from '../components/ui/Toggle'
import { shopInitials } from '../utils/format'
import { categories, sellers } from './mocks/catalog'

/** Gallery of the section II building blocks (batch 0). */
export default function ComponentKit() {
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [qty, setQty] = useState(1)
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState('a')
  const [toggle, setToggle] = useState(true)
  const [province, setProvince] = useState('')

  return (
    <PageContainer className="flex flex-col gap-12 py-10">
      <Section title="Chip">
        <div className="flex flex-wrap gap-2">
          <Chip active={category === 'all'} onClick={() => setCategory('all')}>
            Tất cả
          </Chip>
          {categories.map((c) => (
            <Chip key={c.categoryId} active={category === c.categoryId} onClick={() => setCategory(c.categoryId)}>
              {c.categoryName}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Phân trang">
        <Pagination page={page} totalPages={10} onPageChange={setPage} />
      </Section>

      <Section title="Form controls">
        <div className="flex flex-wrap items-center gap-8">
          <QtyStepper value={qty} onChange={setQty} max={23} />
          <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="Checkbox" />
          <Checkbox disabled aria-label="Checkbox disabled" />
          <div className="flex gap-5">
            <Radio name="r" checked={radio === 'a'} onChange={() => setRadio('a')} label="Radio A" />
            <Radio name="r" checked={radio === 'b'} onChange={() => setRadio('b')} label="Radio B" />
          </div>
          <Toggle checked={toggle} onChange={setToggle} label="Toggle" />
        </div>
        <div className="mt-6 grid max-w-[680px] gap-4 sm:grid-cols-2">
          <SelectField
            label="Tỉnh / Thành phố"
            placeholder="Chọn tỉnh / thành"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            options={[
              { value: '01', label: 'Hà Nội' },
              { value: '79', label: 'TP Hồ Chí Minh' },
            ]}
          />
          <TextareaField label="Nhận xét" placeholder="Chia sẻ cảm nhận của bạn" />
        </div>
      </Section>

      <Section title="Avatar + Sidebar item">
        <div className="flex flex-wrap items-center gap-3">
          {sellers.slice(0, 6).map((s) => (
            <Avatar key={s.sellerId} size="m" initials={shopInitials(s.sellerName)} tone={toneFor(s.sellerId)} />
          ))}
          <Avatar size="l" initials="NA" />
        </div>
        <nav className="mt-6 flex w-[220px] flex-col gap-1">
          <SidebarItem to="/__kit" end icon={<IconUser size={20} />}>
            Hồ sơ
          </SidebarItem>
          <SidebarItem to="/account/addresses" icon={<IconMapPin size={20} />}>
            Địa chỉ
          </SidebarItem>
          <SidebarItem to="/account/password" icon={<IconLock size={20} />}>
            Đổi mật khẩu
          </SidebarItem>
          <SidebarItem to="/account/orders" icon={<IconFileText size={20} />}>
            Đơn mua
          </SidebarItem>
        </nav>
      </Section>
    </PageContainer>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 text-h2 text-text">{title}</h2>
      {children}
    </section>
  )
}
